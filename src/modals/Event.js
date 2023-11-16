
const mongoose = require('mongoose')


const eventSchema = new mongoose.Schema({
    
    type:{
      type: String,
      required: true  
    },

    date:{
        type: Date,
        required: true
    },

    time:{
        type: String,
        required: true
    },
    
    guests:{
        type: Number,
        required: true
    },

    venue:{
        type: String,
        required: true
        
    },

    
    waitors:{
        type: Number,
    },
    
    budget:{
        type: Number,
        required: true
    },

    postedBy:{
        type: String,
        required: true
    },

    completedBy:{
        type: String,
        // required: true
    },
        
    dishes:[""],
        
    decors:{
        type: Array
    },

    // The required property shall remain undefined for now.
    review:
    {
        feedback: { type: String},
        rating: {type: Number}
    },

    responses:[
        {
            company: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Company', // Reference the 'Company' model
                required: true,
              },
            email: { type: String, required: true },
            price: { type: Number, required: true },
            proposal: { type: String, required: true },
            accepted: { type: Boolean, default: false },
            checkedout: { type: Boolean, default: false },
            payment1: { type: Boolean, default: false },
            payment2: { type: Boolean, default: false },
            contact: { type: Number, required: false}
        }
    ],

    
    cost:{
        type: Number
        // required: true
    },
    
    
    posted: {
        type: Boolean,
        default: false
    },

    bidsAccepted: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company', // Reference to the Company model
        },
    ],
    setupPictures:[
        {
            img:{
                type: String
            }
        }
    ],

    completed: {
        type: Boolean,
        default: false
    }

},
{
    timestamps: true
})


module.exports = mongoose.model("Events", eventSchema)