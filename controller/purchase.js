require('dotenv').config();
const Razorpay = require("razorpay")
const Order = require('../models/orders')
const userController = require("./user")
const sequelize = require("../connection/database")

exports.purchasepremium =async (req, res) => {
    try { 
        var rzp = new Razorpay({

            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        console.log("hey itls")
        const amount = 2500;
        let order = await rzp.orders.create({amount, currency: "INR"})
        if(!order)
        {
            return res.status(401).json({
                message:"Some problem in Razorpay"
            })
        }
        await req.user.createOrder({ orderid: order.id, status: 'PENDING'})   
        res.status(201).json({ order, key_id : rzp.key_id});

    } catch(err){
        console.log(err);
        res.status(403).json({ message: 'Sometghing went wrong', error: err})
    }
}

 exports.updateTransactionStatus = async (req, res ) => {
    const t = await sequelize.transaction();
    try {
        const userId = req.user.id;
        const username = req.user.username;
        const { payment_id, order_id} = req.body;
        const order  = await Order.findOne({where : {orderid : order_id}},{transaction:t}) //2
        const promise1 =  order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}) 
        const promise2 =  req.user.update({ ispremiumuser: true }) 
        
        Promise.all([promise1, promise2]).then(async()=> {
            await t.commit();
            return res.status(202).json({sucess: true, message: "Transaction Successful", token: userController.generateAccessToken(userId,username,true) });
        }).catch((error ) => {
            throw new Error(error)
        })

        
                
    } catch (err) {
        await t.rollback();
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Sometghing went wrong' })

    }
}
