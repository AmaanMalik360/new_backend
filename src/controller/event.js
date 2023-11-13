const Event = require('../modals/Event')
const User = require('../modals/user')
const Company = require('../modals/Company')
const { format } = require('date-fns');

exports.addevent = async (req, res) => {
    const { type, date, time, guests, venue, budget, postedBy } = req.body;

    try {
        // Format the date using date-fns
        const formattedDate = format(new Date(date), 'yyyy-MM-dd');

        const e = new Event({ type, date: formattedDate, time, guests, venue, budget, postedBy });

        const event = await e.save();

        res.status(201).json({ event, message: "Event Created Successfully" });
    } catch (error) {
        res.status(409).json({ message: "Error! Try again later", error });
    }
};


exports.addfood = async (req,res) => {

    try {
        const dishes = req.body.selected;
        const cost = req.body.price;

        const eventFood = await Event.findByIdAndUpdate(req.params.id, {dishes,cost},{new:true})
        
        res.status(200).json({eventFood, message: "Food Posted Successfully"})

    } catch (error) {
        res.status(409).json({message: "Error! Try again later", error});
    }
}

exports.addDecor = async (req, res) => {
    try {
        const decor = req.body.selected;
        const decorCost = req.body.totalCost;

        // Use findById to find the event by its unique _id
        const e = await Event.findById(req.params.id);

        if (!e) {
            return res.status(404).json({ message: "Event not found" });
        }

        let cost = decorCost + e.cost;

        // Use findOneAndUpdate to update the event
        const eventDecor = await Event.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    decors: decor,
                    cost: cost,
                    posted: true
                }
            },
            { new: true }
        );

        console.log(eventDecor);

        res.status(200).json({ eventDecor, message: "Decor Posted Successfully" });
    } 
    catch (error) 
    {
        res.status(409).json({ message: "Error! Try again later", error });
    }
};

exports.getResponses = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const email = user.email;
      console.log(email);
  
      // Find events where posted is true and completed is false
      const events = await Event.find({ 
        postedBy: email, 
        posted: true, 
        completed: false
     });
      console.log(events);
  
      res.status(200).json({ events });
    } catch (error) {
      res.status(409).json({ message: "Error! Try again later", error });
    }
};

exports.getEvents = async (req,res) => {
    try 
    {
        const events = await Event.find({posted : true, completed: false}) // with completed false by default now. You will now have to make new events and check how they are made. 
        res.status(200).json(events)  
    } 
    catch (error) 
    {   
        res.status(409).json({message: "Error! Try again later", error});
    } 
}

exports.getEvent = async (req,res) => {
    try 
    {
        console.log("from get event");
        const event = await Event.findById(req.params.id)
        if (!event) 
        {
            return res.status(404).json({ message: "Event not found" });
          }
        res.status(200).json(event)  
    } 
    catch (error) 
    {   
        res.status(409).json({message: "Error! Try again later", error});
    } 
}

exports.registerResponses = async (req, res) => {
    try {
        const { cId, price, text } = req.body; // Change `cId` to `companyId`
        const companyId = cId;
        const proposal = text;

        const event = await Event.findById(req.params.id);

        // Check if the company has already posted a response with the same companyId
        const responseExists = event.responses.some((response) => response.company.toString() === companyId);

        if (responseExists) {
            return res.status(409).json({ message: "Response already exists for this company" });
        } else {
            // Fetch the company's email
            const company = await Company.findById(companyId);
            const companyEmail = company.email;

            // If the response doesn't already exist, add it to the responses array
            event.responses.push({ company: companyId, email: companyEmail, price, proposal });
            const updatedEvent = await event.save();

            res.status(200).json({ event: updatedEvent, message: "Response Posted Successfully" });
        }
    } catch (error) {
        console.log(error);
        res.status(409).json({ message: "Error! Try again later", error });
    }
};


exports.acceptBid = async (req, res) => {
    const eventId = req.params.id; // The event ID where the bid is accepted
    const companyId = req.body.cId; // The ID of the company whose bid is accepted

    try {
        // Find the event by ID
        const event = await Event.findById(eventId);
        console.log("From Accept Bid: ", event);
        
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

       // Find the response within the event's responses array
        const response = event.responses.find(
            (r) => r.company.toString() === companyId
        );
    
        if (!response) {
            return res
            .status(404)
            .json({ message: "Response not found for this company" });
        }
    
        // Check if the response is already accepted
        if (response.accepted) {
            return res.status(409).json({ message: "Bid already accepted from this company" });
        }
    
        // Update the response's accepted status
        response.accepted = true;
    
        // Push the company ID into the bidsAccepted field
        event.bidsAccepted.push(companyId);

        // Save the event with the updated response
        await event.save();
    
        res.status(200).json({ message: "Bid accepted successfully" });
    
    } catch (error) {
        res.status(409).json({ message: "Error! Try again later", error });
    }
};

exports.updateBid = async (req,res) =>{
    const eventId = req.params.id; // The event ID where the bid is accepted
    const companyId = req.body.cId; // The ID of the company whose bid is accepted
    const newprice = req.body.updatedPrice
    try 
    {
        // Find the event by ID
        const event = await Event.findById(eventId);
        console.log("From Update Bid: ", event);
        
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

       // Find the response within the event's responses array
        const response = event.responses.find(
            (r) => r.company.toString() === companyId
        );

        if (!response) {
            return res
            .status(404)
            .json({ message: "Response not found for this company" });
        }

        console.log("response found");

        response.price = newprice;

        // Save the event with the updated response
        await event.save();
    
        res.status(200).json({ message: "Bid accepted successfully" });
    
    } 
    catch (error) 
    {
        console.log(error);
        res.status(409).json({ message: "Error! Try again later", error });
    }
}

exports.completed = async (req, res) => 
{
    const eventId = req.params.id; // The event ID where the bid is accepted
    const companyId = req.body.cId; // The ID of the company who completed the event 
    const feedback = req.body.feedback;
    const rating = req.body.rating;
  
    try {
      // Find the company by ID
      const company = await Company.findById(companyId);
  
      if (!company) 
      {
        return res.status(404).json({ message: 'Company not found' });
      }
  
        // Calculate the new average rating for the company
        const currentRating = company.rating || 0; // Default to 0 if rating is not present
        const numberOfRatings = company.numberOfRatings || 0;
        const newAverageRating =
            (currentRating * numberOfRatings + rating) / (numberOfRatings + 1);
    
        // Update the company's rating
        await Company.findByIdAndUpdate(companyId, {
            rating: newAverageRating,
            $inc: { numberOfRatings: 1 }, // Increment the number of ratings
        });
  
        // Update the event with the feedback and rating
        await Event.findByIdAndUpdate(eventId, {
        $set: {
            completedBy: company.email,
            completed: true,
            review: {
                feedback: feedback,
                rating: rating,
          },
        },
      });
  
      res.status(200).json({ message: 'Event marked as completed successfully' });
    } catch (error) {
      console.error(error);
      res.status(409).json({ message: 'Error! Try again later', error });
    }
};


exports.getCompleted = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const email = user.email;
      console.log(email);
  
      // Find events where posted is true and completed is true
      const events = await Event.find({ postedBy: email, posted: true, completed: true });
      console.log(events);
        
      res.status(200).json({ events });
    } catch (error) {
      res.status(409).json({ message: "Error! Try again later", error });
    }
};

exports.getCompletedCompany = async (req, res) => {
    try {
      const company = await Company.findById(req.params.id);
      const email = company.email;
      console.log(email);
  
      // Find events where posted is true and completed is true
      const events = await Event.find({  completedBy: email, posted: true, completed: true });
      console.log(events);
  
      res.status(200).json({ events });
    } catch (error) {
      res.status(409).json({ message: "Error! Try again later", error });
    }
};
  