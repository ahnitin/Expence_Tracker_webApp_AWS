const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
//const path = require("path");

const sequelize = require("./connection/database");
const Users = require("./models/user");

app.use(bodyParser.urlencoded({extended:false}));
app.use(cors())
app.use(express.json());

// app.get("/signup",(req,res,next)=>{
//     res.sendFile(path.join(__dirname,"sign-up_Page.html"));
// })

app.post("/signup",(req,res,next)=>{
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
})

sequelize
.sync()
.then(res=>{
    console.log("success")
    app.listen(3002);
})
.catch(err=>{
    console.log(err)
})

