const Event = require('../modals/Event')
const User = require('../modals/user')
const Company = require('../modals/Company')
const stripe = require("stripe")(`${process.env.SK_TEST}`)


const {google} = require('googleapis')
const nodemailer = require('nodemailer');
const Oauth2 = google.auth.OAuth2;
let accessToken;

exports.createCheckout = async (req, res) => {
  const { event, email, price } = req.body;

  console.log("From Checkout: ", event);

  try {
      const company = await Company.findOne({ email: email });

      // Find the response within the event's responses array for the given company
      const response = event.responses.find((r) => r.company.toString() === company._id.toString());

      if (!response) {
          return res.status(404).json({ message: "Response not found for this company" });
      }

      // Check if payment1 for the response is true
      if (response.payment1) 
      {
          
          // Redirect to the first success screen
          const session = await stripe.checkout.sessions.create({
              payment_method_types: ["card"],
              line_items: [
                  {
                      price_data: {
                          currency: "pkr",
                          product_data: {
                              name: event.type,
                          },
                          unit_amount: price * 100,
                      },
                      quantity: 1,
                  },
              ],
              mode: "payment",
              success_url: `http://localhost:3000/payment-success2/${event._id}/${company._id}`,
              cancel_url: `http://localhost:3000/view-responses`,
          });

          return res.status(200).json({ id: session.id });
      }

      // If payment1 is false, redirect to the second success screen
      const lineItems = [
          {
              price_data: {
                  currency: "pkr",
                  product_data: {
                      name: event.type,
                  },
                  unit_amount: price * 100,
              },
              quantity: 1,
          },
      ];

      const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          success_url: `http://localhost:3000/payment-success/${event._id}/${company._id}`,
          cancel_url: `http://localhost:3000/view-responses`,
      });

      res.status(200).json({ id: session.id });
  } catch (error) {
      console.error("Error creating a payment session:", error);
      res.status(409).json({ message: "Error creating a payment session", error });
  }
};





const createTransporter = async () => {
  try {
    const oauth2Client = new Oauth2(
      process.env.CLIENT_ID2,
      process.env.CLIENT_SECRET2,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN2,
    });

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.error("Failed to fetch the access token:", err);
          console.error("OAuth2 error details:", err.response.data);
          reject(err);
        }
        resolve(token);
      });
    });

    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.MY_EMAIL,
        accessToken,
        clientId: process.env.CLIENT_ID2,
        clientSecret: process.env.CLIENT_SECRET2,
        refreshToken: process.env.REFRESH_TOKEN2,
      },
    });
  } 
  catch (error) 
  {
    console.error("Error creating transporter:", error);
    throw error; // Re-throw the error to indicate failure
  }
}

const sendEmail = async (emailOptions) =>{
  try 
  {
    const transporter = await createTransporter();
    await transporter.sendMail(emailOptions);
  } 
  catch (error) 
  {
    console.log("Error in sendEmail",error);
  }
}

// new

exports.checkedOutBid = async (req, res) => {
  const eventId = req.params.eventId;
  const companyId = req.params.companyId;
  const mail = req.body.email; // user email
  try {
    // Find the event by ID
    let event = await Event.findById(eventId);
    let company = await Company.findById(companyId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Find the response within the event's responses array
    const response = event.responses.find((r) => r.company.toString() === companyId);

    if (!response) {
      return res.status(404).json({ message: "Response not found for this company" });
    }

    // Update the response's checkedout status
    const p = response.price / 2;

    console.log(`From Checkedout Bid API after checking response as true with ${p}`, response);

    const msg = `Hey there! This mail is to confirm that ${mail} has paid the ${p}. You will be transacted the amount on the card registered with us.`;
    // Now sending confirmation mail to company

    const options = {
      from: process.env.MY_EMAIL,
      to: company.email,
      subject: "Payment Successfully Done. ",
      text: msg,
    };

    const msg2 = `Hey there! This mail is to confirm that you ${mail} have paid ${p} to ${company.email}.`;
    // Now sending confirmation mail to client

    const options2 = {
      from: process.env.MY_EMAIL,
      to: event.postedBy,
      subject: "Payment Successfully Done. ",
      text: msg2,
    };

    // Now update the payment fields based on the number of payments
    if (!response.payment1) {
      response.checkedout = true;
      response.payment1 = true;

      // Add the event date to the bookings field of the company
      company.bookings.push({ date: event.date });

      // Delete other responses for the same company
      event.responses = event.responses.filter(
        (r) => r.company.toString() === companyId && r._id.equals(response._id)
      );
      console.log("Payment 1 marked as done");

      sendEmail(options);
      sendEmail(options2);

      // Save the event with the updated response and payment status
      event = await event.save();
      // Save the company with the updated bookings field
      company = await company.save();

      res.status(200).json({ message: "Payment 1 and checkedout marked as true successfully." });
    } else if (!response.payment2) {
      response.payment2 = true;
      console.log("Payment 2 marked as done");

      // Remove the event date from the bookings field of the company
      // company.bookings = company.bookings.filter((booking) => !booking.date.equals(event.date));

      sendEmail(options);
      sendEmail(options2);

      // Save the event with the updated response and payment status
      event = await event.save();
      // Save the company with the updated bookings field
      company = await company.save();

      res.status(200).json({ message: "Response marked as checked out successfully." });
    }
  } catch (error) {
    console.error("Error marking response as checked out", error);
    res.status(409).json({ message: "Error! Try again later", error });
  }
};


