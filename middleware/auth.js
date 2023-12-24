require('dotenv').config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authenticate = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        console.log(token)
        const user = jwt.verify(token,process.env.SECRET_KEY);
        console.log(user)
        if (!user || !user.userId) {
            throw new Error("Invalid user in token");
        }

        User.findByPk(user.userId)
            .then(user => {
                if (!user) {
                    throw new Error("User not found");
                }
                req.user = user;
                next();
            })
            .catch(err => {
                throw new Error(err);
            });
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
};
