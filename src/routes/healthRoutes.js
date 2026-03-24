const express = require('express');
const router = express.Router();
const controller = require('../controllers/healthController');


router.get('/server-connection-test', controller.serverCheck);
router.get('/db-connection-test', controller.dbCheck);

module.exports = router;