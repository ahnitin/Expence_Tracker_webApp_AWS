require('dotenv').config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../connection/database");

const PostSignup = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        console.log(username, email, password);
        const saltrounds = 10;

        // Hash the password
        const hash = await bcrypt.hash(password, saltrounds);

        // Create the user
        await User.create({
            username: username,
            email: email,
            password: hash
        }, { transaction: t });

        await t.commit();
        return res.status(201).json({ message: "successfully created new user" });
    } catch (err) {
        await t.rollback();
        res.status(500).json({
            message: "Something Went Wrong!",
            err
        });
    }
}

const generateAccessToken=(id,name,ispremiumuser)=>{
    return jwt.sign({userId: id,name:name,ispremiumuser},process.env.SECRET_KEY)
}

const PostLogin = async (req,res,next)=>{
    const t = await sequelize.transaction();
    try {
        const email = req.body.email;
        const password = req.body.password;
        let user = await User.findOne({where:{email:email}},{transaction:t});
        if(!user)
        {
            await t.rollback();
            return res.status(404).json({
                success:false,message: "User Doesnot Exists",
            })
        }
        
        let response = await bcrypt.compare(password, user.password)
        console.log(response)
            if(response === false)
            {
                await t.rollback();
                res.status(401).json({success:false,message:"Password Is Incorrect"})
            }
            else if(response === true)
            {
                await t.commit();
                res.status(201).json({success: true, message: "user Logged In Successfully", token: generateAccessToken(user.id,user.username,user.ispremiumuser)});
            }

    } catch (error) {
        await t.rollback();
        return res.status(500).json({
            message: "Something Went Wrong! ",
            error,
            success: false,    
        })
    }
    //console.log(email,password);
}

module.exports ={
    PostSignup,
    PostLogin,
    generateAccessToken,
}