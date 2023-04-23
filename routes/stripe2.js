const express = require("express");
require('dotenv').config();
const { setOrder, getOrdersbyUserID, conector, getDecodedToken } = require("../mysql_conector")
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_API_KEY)



router.post("/create-payment-intent", async (req, res) => {
  const { basket } = req.body;
  let total = 0;

  const productItems = basket.map((item) => {
    let images;
    total += item.price * item.quantity
    try {
      images = JSON.parse(item.images);
    } catch (error) {
      console.error(`Error parsing images for item ${item.title}: ${error}`);
    }
    const name = `${item.quantity} x \t ${item.title} - Price Unit = € ${item.price.toFixed(2)}`;
    console.log(name)
    return {
      price_data: {
        currency: 'eur',
        product_data: {
          name,
          images: [images[0].url],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    };
  });

  const items = productItems.map(item => `${item.price_data.product_data.name}`).join('\n\n');
  console.log(items)

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100),
    currency: "eur",
    payment_method_types: ['card'],
    description: items
  });

  res.send({
    id: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
  });
});



router.post("/update-payment-intent", async (req, res) => {
  const { id, email, address } = req.body;

  // Check if user is customer
  const customers = await stripe.customers.list({ email: email, limit: 1 });
  let customer;

  if (customers.data.length === 0) {
    customer = await stripe.customers.create({
      email: email,
      name: address.name,
    });
  } else {
    customer = customers.data[0].id;
  }

  const paymentIntent = await stripe.paymentIntents.update(id, {
    customer: customer,
    receipt_email: email,
    shipping: {
      name: address.name,
      address: {
        line1: address.address.line1,
        line2: address.address.line2 || null,
        city: address.address.city,
        state: address.address.state,
        postal_code: address.address.postal_code,
        country: address.address.country,
      },
    },
  });

  res.send({ paymentIntent });
});


//Retrieve payment intent and set order into database.
router.post("/set-order", async (req, res) => {
  const { order_id, basket } = req.body;
  const paymentIntent = await stripe.paymentIntents.retrieve(order_id)
  if (paymentIntent.status === "succeeded") {

    const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
    console.log(paymentIntent.payment_method)
    console.log(paymentMethod.type)



    const method = paymentMethod.type
    const address = paymentIntent.shipping
    console.log(address)

    setOrder(req, res, order_id, basket, address,method)

    const invoice = await stripe.invoices.create({
      customer: paymentIntent.customer,
      description: paymentIntent.description,
      collection_method: "send_invoice",
      days_until_due: 7 // Set the collection method to "send_invoice"
    });

    const invoiceUrl = await stripe.invoices.sendInvoice(invoice.id);
    console.log(`Invoice ${invoice.id} sent to customer ${paymentIntent.customer} at ${paymentIntent.receipt_email}`);

    // res.send({ paymentIntent });
  }

  // res.send({ paymentIntent })


});

router.post('/api/user/get/orders', async (req, res) => {

  const QUERY = "SELECT * from orders WHERE user_id = ? ORDER BY order_id ASC";
  const user_id = getDecodedToken(req);
  conector.query(QUERY, [user_id.id], async (err, rows) => {
    if (err) console.log(err);
    const data = JSON.parse(JSON.stringify(rows));

    let order_information = []; 

    await Promise.all(data.map(async (row) => {
       order_id = row.order_id;
       const paymentIntent = await stripe.paymentIntents.retrieve(order_id)
       order_information.push({ order_id: paymentIntent.id, shipping: paymentIntent.shipping, total: paymentIntent.amount / 100});

    }));

    res.send({ data, order_information});
  })

})




module.exports = router;
