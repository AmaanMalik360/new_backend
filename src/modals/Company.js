const mongoose = require('mongoose');
const bcrypt = require('bcrypt')


const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        min: 3,
    },

    contact:{
        type: Number,
        unique: true,
        required: true
    },
    
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    
    password: {
        type: String,
        required: true,
    },
    
    services: {
        type: Array,
        required: true
    }, // unused yet
    

    profilePicture: {type: String}  // unused yet

}, {timestamps: true})

// companySchema.virtual('password')
// .set(function(password){
//     this.hash_password = bcrypt.hash(password,10)  
// })


companySchema.pre('save', async function (next) {
    console.log( "hi from inside")

    if (this.isModified('password')) {

        this.password = await bcrypt.hash(this.password, 10)
    
    }
    next()   
})


companySchema.virtual('fullName')
    .get(function(){
        return `${this.firstName} ${this.lastName}`
})


companySchema.methods = {
    authenticate: async function(password){
        try {
            let result = await bcrypt.compare(password, this.password); 
            return result  
            
        } catch (error) {
            return false
        }
    }
}


module.exports = mongoose.model('Company',companySchema)