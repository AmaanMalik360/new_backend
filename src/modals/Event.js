
const mongoose = require('mongoose')


const eventSchema = new mongoose.Schema({
    
    type:{
      type: String,
      required: true  
    },

    date:{
        type: String,
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
    
    dishes:[""],

    decors:{
        type: Array
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
        }
    ],
    
    cost:{
        type: Number
        // required: true
    },
    
    
    posted: {
        type: Boolean
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

},
{
    timestamps: true
})


module.exports = mongoose.model("Events", eventSchema)