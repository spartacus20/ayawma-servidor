const express = require("express");
const { restart } = require("nodemon");
const Stripe = require('stripe');
require('dotenv').config(); 


const router = express.Router();
const stripe = Stripe(process.env.STRIPE_API_KEY)
const CLIENT_URL = process.env.CLIENT_URL;


router.post('/create-checkout-session', async (req, res) => {
  
  

  
  const line_items = req.body.basket.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
         // images: [item.image],
         
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    };
  });
  
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    shipping_address_collection: {
      allowed_countries: ['US', 'CA'],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 0,
            currency: 'usd',
          },
          display_name: 'Free shipping',
          // Delivers between 5-7 business days
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 5,
            },
            maximum: {
              unit: 'business_day',
              value: 7,
            },
          }
        }
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 1500,
            currency: 'usd',
          },
          display_name: 'Next day air',
          // Delivers in exactly 1 business day
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 1,
            },
            maximum: {
              unit: 'business_day',
              value: 1,
            },
          }
        }
      },
    ],
    line_items,
    mode: 'payment',
    success_url: CLIENT_URL,
    cancel_url: CLIENT_URL,
  });

  res.send({ url: session.url });
});

module.exports = router;