const Users = require("../models/user");
exports.PostSignup = (req,res,next)=>{
    const username = req.body.username;
    const email  = req.body.email;
    const password = req.body.password;
    console.log(username,email,password);
    Users.create({
        username:username,
        email:email,
        password:password,
    })
    .then(result=>{
        res.status(201).json({
            user: result
        })
    })
    .catch(err=>{
        res.status(403).json({
            error:err
        })
    })
}

exports.PostLogin = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    //console.log(email,password);
    Users.findOne({where:{email:email}})
    .then(result=>{
        if(result === null)
        {
            res.status(404).json({
                result: result
            })
        }
        else if(result.password ===  password)
        {
            res.status(201).json({
                result:result
            })
        }
        else if(result.password != password)
        {
            res.status(401).json({
                result:result
            })
        }
    })
    .catch(error=>{
        res.status(500).json({
            error:error
        })
    })
}