const express = require('express');

const expenseController = require('../controller/expence')


const router = express.Router();

router.post('/addexpense', expenseController.addExpense )

router.get('/getexpenses' ,  expenseController.getExpenses )

router.delete('/deleteexpense/:expenseid', expenseController.deleteExpense)

module.exports = router;