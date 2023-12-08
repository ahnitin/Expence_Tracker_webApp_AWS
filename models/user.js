const Sequelize = require("sequelize");
const sequelize = require("../connection/database");
const Users = sequelize.define("user",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    username:{
        type: Sequelize.STRING,
        allowNull: false,
        unique:true,
    },
    email:{
        type:Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    ispremiumuser: Sequelize.BOOLEAN,
    totalExpense:{
        type:Sequelize.INTEGER
    }
})
module.exports = Users;