const Users = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../connection/database");

const PostSignup = async (req,res,next)=>{
    const t = await sequelize.transaction();
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
        },{transaction:t})
        await t.commit();
        res.status(201).json({message: "successfully created new user"});

    })
    }
    catch(err){
        await t.rollback();
        res.status(500).json(err)
    }
}
const generateAccessToken=(id,name,ispremiumuser)=>{
    return jwt.sign({userId: id,name:name,ispremiumuser},'secretkey')
}

const PostLogin = async (req,res,next)=>{
    const t = await sequelize.transaction();
    try {
        const email = req.body.email;
        const password = req.body.password;
        let user = await Users.findAll({where:{email:email}},{transaction:t});
        if(user.length === 0)
        {
            await t.rollback();
            return res.status(404).json({
                success:false,message: "User Doesnot Exists",
            })
        }
        else{
        bcrypt.compare(password, user[0].password,async(err,response)=>{
            console.log(response);
            if(response === false)
            {
                await t.rollback();
                res.status(401).json({success:false,message:"Password Is Incorrect"})
            }
            else if(response === true)
            {
                await t.commit();
              res.status(201).json({success: true, message: "user Logged In Successfully", token: generateAccessToken(user[0].id,user[0].username,user[0].ispremiumuser)});
            }
        })
        } 

    } catch (error) {
        await t.rollback();
        res.status(500).json({
            message: err,
            success: false,    
        })
    }
    //console.log(email,password);
}
module.exports ={
    PostSignup,
    PostLogin,
    generateAccessToken
}