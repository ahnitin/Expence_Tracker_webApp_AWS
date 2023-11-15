const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");

const sequelize = require("./connection/database");
const Users = require("./models/user");

app.use(bodyParser.urlencoded({extended:false}));

app.get("/signup",(req,res,next)=>{
    res.sendFile(path.join(__dirname,"sign-up_Page.html"));
})

app.post("/signup",(req,res,next)=>{
    const username = req.body.username;
    const email  = req.body.email;
    const password = req.body.password;

    Users.create({
        username:username,
        email:email,
        password:password,
    })
    .then(result=>{
        console.log("Added to database")
    })
    .catch(err=>{
        console.log(err);
    })
})

sequelize
.sync()
.then(res=>{
    console.log("success")
})
.catch(err=>{
    console.log(err)
})
app.listen(3002);
