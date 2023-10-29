const Company = require('../../modals/Company')
const jwt = require('jsonwebtoken')

exports.adminSignup = async (req,res) => {

    const {name, email, contact, services, password } = req.body;
    try
    {
        const company = await Company.findOne({email: email})

        if(company){
            return res.status(422).json({message:'Email already Exist'})
        }

        const new_company = new Company({
            name,
            email,
            contact,
            services,
            password
        })

        await new_company.save()

        console.log("New Company: ",new_company);

        res.status(201).json({message:"Company registered Successfully"})     
        
    }
    catch(err){

        res.status(409).json({message: "Error Found"});
    }
}


exports.adminSignin = async (req,res) => {

    try
    {
        const {email, password} = req.body;

        const company = await Company.findOne({email: email})
        if(company){

            const con = await company.authenticate(password)

            console.log(con)
            if(con)
            {
                const token = await jwt.sign({_id: company._id}, process.env.JWT_SECRET, {expiresIn: '1h'})

                const {_id, name, email, fullname} = company;
                
                res.status(200).json({
                    token,
                    company:
                    {
                        _id, name, email, fullname
                    },
                    message: "Company Signed-in Successfully"
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
