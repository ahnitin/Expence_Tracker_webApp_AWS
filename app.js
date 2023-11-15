const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
//const path = require("path");

const sequelize = require("./connection/database");
const Users = require("./models/user");

const userRoutes = require("./routes/user");

app.use(bodyParser.urlencoded({extended:false}));
app.use(cors())
app.use(express.json());

app.use(userRoutes);

sequelize
.sync()
.then(res=>{
    console.log("success")
    app.listen(3002);
})
.catch(err=>{
    console.log(err)
})

