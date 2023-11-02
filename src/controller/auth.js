const User = require('../modals/user')
const jwt = require('jsonwebtoken')

exports.signup = async (req,res) => {

    const {name, email, contact, password} = req.body;
    try
    {
        const user = await User.findOne({email: email})

        if(user){
            return res.status(422).json({message:'Email already Exist'})
        }

        const new_user = new User({
            name,
            email,
            contact,
            password
        })

        await new_user.save()

        console.log("New User: ",new_user);

        res.status(201).json({message:"user registered Successfully"})     
        
    }
    catch(err){

        res.status(409).json({message: "Error Found"});
    }
}


exports.signin = async (req,res) => {

    try
    {
        const {email, password} = req.body;

        const user = await User.findOne({email: email})
        if(user){

            const con = await user.authenticate(password)

            console.log(con)
            if(con)
            {
                const token = await jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '3h'})

                const {_id, name, email, fullname} = user;
                
                res.status(200).json({
                    token,
                    user:
                    {
                        _id, name, email, fullname
                    },
                    message: "User Signed-in Successfully"
                })
            }
            else
            {
                res.status(400).json({message: "Invalid Password"})     
            }
        }
    }
    catch(error){
        
        res.status(409).json({message: "Error! Try again later"});
    }
   
}