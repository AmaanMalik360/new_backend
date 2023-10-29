const Event = require('../modals/Event')
const User = require('../modals/user')
const Company = require('../modals/Company')

exports.addevent = async (req,res) => {
    const { type, date, time, guests, venue, budget, postedBy } = req.body;
    
    try {
        
        const e = new Event({ type, date, time, guests, venue, budget, postedBy });
        
        const event = await e.save();

        res.status(201).json({event, message: "Event Created Successfully"})
    } 
    catch (error) {
        res.status(409).json({message: "Error! Try again later", error});
    }
}

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

exports.getResponses = async (req,res) => {
    try 
    {
        const user = await User.findById(req.params.id)
        const email = user.email
        console.log(email)
        
        const events = await Event.find({postedBy:email})
        console.log(events);
        
        res.status(200).json({events})    
    } 
    catch (error) 
    {   
        res.status(409).json({message: "Error! Try again later", error});
    } 
}
exports.getEvents = async (req,res) => {
    try 
    {
        const events = await Event.find({posted : true})
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

exports.checkedOutBid = async (req, res) => {
    
    const eventId = req.params.eventId;
    const companyId = req.params.companyId;

    try 
    {
        // Find the event by ID
        let event = await Event.findById(eventId);

        if (!event) {
        return res.status(404).json({ message: "Event not found" });
        }

        // Find the response within the event's responses array
        const response = event.responses.find((r) => r.company.toString() === companyId);

        if (!response) {
        return res.status(404).json({ message: "Response not found for this company" });
        }

        // Update the response's checkedout status
        response.checkedout = true;
        console.log("From Checkedout Bid API after checking response as true.", response);

        // Save the event with the updated response
        event = await event.save();

        res.status(200).json({ message: "Response marked as checked out successfully" });
    } 
    catch (error) 
    {
        console.error("Error marking response as checked out", error);
        res.status(409).json({ message: "Error! Try again later", error });
    }
};