const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

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


const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    { flags:'a'}
    )

app.use(bodyParser.urlencoded({extended:false}));
app.use(compression())
app.use(morgan('combined',{stream: accessLogStream}))
app.use(cors())
app.use(express.json());



app.use(express.static('public'));
app.use(userRoutes);
app.use(expenseRoutes);
app.use('/purchase', purchaseRoutes)

app.use(premiumRoutes)

app.use("/password",passwordRoutes)
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, `${req.url}`), (err) => {
    if (err) {
      next(err);
    }
  });
});


// app.use(express.static(path.join(__dirname, 'public')));

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
  .then(() => {
    console.log("Database synchronization successful.");
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server running on port:", process.env.PORT || 3000);
    });
  })
  .catch(err => {
    console.error("Database synchronization error:", err);
    console.error("Connection error details:", err.parent); // Log the detailed connection error
  });
