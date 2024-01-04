const Sequelize = require('sequelize');
const sequelize = require('../connection/database');

const Expense = sequelize.define('expenses', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    expenseamount:{
        type: Sequelize.INTEGER,
        allowNull:false,
    },
    category:{
        type: Sequelize.STRING,
        allowNull:false,
    }, 
    description: Sequelize.STRING,
})

module.exports = Expense;