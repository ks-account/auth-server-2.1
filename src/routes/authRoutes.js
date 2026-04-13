const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');



router.post('/login', controller.login);
router.post('/signup', controller.signup);
router.post('/logout', controller.logout);
router.post('/validate-token', controller.validateToken);


module.exports = router;