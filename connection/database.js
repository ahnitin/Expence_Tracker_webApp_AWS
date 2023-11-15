const Sequelize = require("sequelize").Sequelize;

const sequelize = new Sequelize("expence-tracker","root","good@123",{
    dialect: "mysql",
    host: "localhost",
})

module.exports = sequelize;