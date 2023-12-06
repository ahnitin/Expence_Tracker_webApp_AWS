const express = require('express');

const premiumFeatureController = require('../controller/premiumFeature');

const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/showLeaderBoard',premiumFeatureController.getUserLeaderBoard);


module.exports = router;