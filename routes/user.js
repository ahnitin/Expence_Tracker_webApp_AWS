const express = require("express");
const router = express.Router();
const userController = require("../controller/user");

router.post("/signup",userController.PostSignup);

router.post("/login",userController.PostLogin);



module.exports = router;