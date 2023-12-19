const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
//const path = require("path");

const sequelize = require("./connection/database");
const User = require("./models/user");
const Expence = require("./models/expence");
const Order = require("./models/orders")
const Forgotpassword = require("./models/forgotpassword")
const DownloadFiles = require("./models/downloadFiles");

const userRoutes = require("./routes/user");
const purchaseRoutes = require('./routes/purchase')
const expenseRoutes = require("./routes/expence");
const premiumRoutes = require("./routes/premiumFeature");
const passwordRoutes = require("./routes/resetPassword");

const dotenv = require("dotenv");
const Razorpay = require("razorpay")
dotenv.config();

app.use(bodyParser.urlencoded({extended:false}));
app.use(cors())
app.use(express.json());



app.use(userRoutes);
app.use(expenseRoutes);
app.use('/purchase', purchaseRoutes)

app.use(premiumRoutes)

app.use("/password",passwordRoutes)

User.hasMany(Expence);
Expence.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(DownloadFiles);
DownloadFiles.belongsTo(User);

sequelize
.sync()
.then(res=>{
    console.log("success")
    app.listen(3002);
})
.catch(err=>{
    console.log(err)
})

