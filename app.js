const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
//const path = require("path");

const sequelize = require("./connection/database");
const User = require("./models/user");
const Expence = require("./models/expence");
const Order = require("./models/orders")

const userRoutes = require("./routes/user");
const purchaseRoutes = require('./routes/purchase')
const expenseRoutes = require("./routes/expence");

const dotenv = require("dotenv");
dotenv.config();

app.use(bodyParser.urlencoded({extended:false}));
app.use(cors())
app.use(express.json());

app.use(userRoutes);
app.use(expenseRoutes);
app.use('/purchase', purchaseRoutes)

User.hasMany(Expence);
Expence.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
.sync()
.then(res=>{
    console.log("success")
    app.listen(3002);
})
.catch(err=>{
    console.log(err)
})

