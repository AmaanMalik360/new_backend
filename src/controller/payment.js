const Event = require('../modals/Event')
const User = require('../modals/user')
const Company = require('../modals/Company')
const stripe = require("stripe")("sk_test_51O2J2bSEe0mVyEmns4JkwOolirpMRD0PEXkTxXE2520wCYBzX0msbDhZCLxjYtl27bSM7Tk2JjjLxf0qyBv2cYl300JIUkfAkd")

exports.createCheckout = async (req,res) => {
    const {event, price, email} = req.body; 
    
    console.log("From Checkout: ", event);

    try 
    {
        const company = await Company.findOne({email:email});

        const lineItems = 
        [  
            {
                price_data:{
                    currency: "inr",
                    product_data: { // Use product_data instead of event_data
                        name: event.type, // Name of the product/event
                    },
                    unit_amount: price*100,
                },
                quantity: 1
            }
        ]

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],  
            line_items: lineItems,
            mode: "payment",
            success_url: `http://localhost:3000/payment-success/${event._id}/${company._id}`,
            cancel_url: `http://localhost:3000/payment-cancel`,
        })
        
        res.status(200).json({id:session.id})
    } 
    catch (error) 
    {
        console.error("Error creating a payment session:", error);
        res.status(409).json({ message: "Error creating a payment session", error });
    }

}

// ----------------------------------------------- Webhooks Setup with Stripe -------------------------


// The library needs to be configured with your account's secret key.
// Ensure the key is kept out of any version control system you might be using.


// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_fcbb33a654eb7ef2b48dd48b4dd640cd56adabdbe1d593826836b2a6f2cfae66";

exports.paymentNotification = async (req, res) => {
    
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 res to acknowledge receipt of the event
  res.send();
}

