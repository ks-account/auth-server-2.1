const pool = require('../config/db');



exports.serverCheck = (req, res) => {
    res.send(true);
};


exports.dbCheck = async (req, res) => {
    try {   
        await pool.query('SELECT 1');
        res.send(true);
    } catch  {
        res.send(false);
    }
};