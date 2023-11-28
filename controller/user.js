const Users = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.PostSignup = async (req,res,next)=>{
    try{
    const username = req.body.username;
    const email  = req.body.email;
    const password = req.body.password;
    console.log(username,email,password);
    const saltrounds =10;
    bcrypt.hash(password, saltrounds, async(err,hash)=>{
        await Users.create({
            username:username,
            email:email,
            password: hash
        })
        res.status(201).json({message: "successfully created new user"});

    })
    }
    catch(err){
        res.status(500).json(err)
    }
}
function generateAccessToken(id){
    return jwt.sign({userId: id},'secretkey')
}

exports.PostLogin = (req,res,next)=>{

    const email = req.body.email;
    const password = req.body.password;
    //console.log(email,password);
    
    Users.findAll({where:{email:email}})
    .then(user=>{
        if(user.length === 0)
        {
            return res.status(404).json({
                success:false,message: "User Doesnot Exists",
            })
        }
        else{
        bcrypt.compare(password, user[0].password,(err,response)=>{
            console.log(response);
            if(response === false)
            {
                res.status(401).json({success:false,message:"Password Is Incorrect"})
            }
            else if(response === true)
            {
              res.status(201).json({success: true, message: "user Logged In Successfully", token: generateAccessToken(user[0].id)});
            }
        })
        }   
    })
    .catch(error=>{
        res.status(500).json({
            message: err,
            success: false,    
        })
    })
}