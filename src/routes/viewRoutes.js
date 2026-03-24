const express = require('express');
const router = express.Router();
const controller = require('../controllers/viewController');
const auth = require('../middleware/authMiddleware');


router.get('/login', controller.loginPage);
router.get('/signup', controller.signupPage);
// DO the auth check before move to the menu page
router.get('/menu', auth, controller.menuPage);


module.exports = router;