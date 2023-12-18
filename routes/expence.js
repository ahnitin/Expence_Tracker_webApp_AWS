const express = require('express');

const expenseController = require('../controller/expence')
const userAuthentication = require("../middleware/auth");

const router = express.Router();

router.post('/addexpense',userAuthentication.authenticate, expenseController.addExpense )

router.get('/getexpenses' ,userAuthentication.authenticate,  expenseController.getExpenses )

router.get("/download",userAuthentication.authenticate,expenseController.downloadExpense)

//router.get("/checkpremium",userAuthentication.authenticate, expenseController.checkPremium)

router.delete('/deleteexpense/:expenseid',userAuthentication.authenticate, expenseController.deleteExpense)

module.exports = router;