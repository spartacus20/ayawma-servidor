const express = require("express");
require('dotenv').config();

const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_API_KEY)

const calculateOrderAmount = (items) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1400;
};

router.post("/create-payment-intent", async (req, res) => {
    const { basket } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1400,
        currency: "eur",
        automatic_payment_methods: {
          enabled: true,
        },
      });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
});

module.exports = router;
