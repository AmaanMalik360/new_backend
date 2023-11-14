const Company = require('../../modals/Company')
const jwt = require('jsonwebtoken')

exports.adminSignup = async (req,res) => {

    const {name, email, contact, cnic, ownerName, services, password } = req.body;
    const ownerCnic = cnic;
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
            ownerCnic,
            ownerName,
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

                const {_id, name, email, fullname, profilePicture} = company;
                
                res.status(200).json({
                    token,
                    company:
                    {
                        _id, name, email, fullname, profilePicture
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

exports.getCompany = async (req,res) =>{
    
    try {
        const company  = await Company.findById(req.params.id)
        res.status(200).json({"sucess":true,company})
    } 
    catch (error)
    {
        console.log(error);
        res.status(409).json({message: "Error! Try again later", error});
    }
}

exports.imageUploadCompany = async (req,res) => {

    console.log(req.file);
    console.log(req.params.id);
    try 
    {
        let company = await Company.findById(req.params.id).select('+profilePicture');
        if (!company) 
        {
            return res.status(404).json({ message: 'Company not found' });
        }

        console.log(company);
        company.profilePicture = req.file.filename;
        await company.save();
        const profilePicture = company.profilePicture
        res.status(209).json({message: "Image posted successfully", profilePicture})

    } 
    catch(error){
        
        res.status(409).json({message: "Error! Try again later"});
    }
   
}

exports.imageGet = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const profilePicture = company.profilePicture;

        res.status(200).json({ profilePicture});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error! Try again later' });
    }
};