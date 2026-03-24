const jwt = require('jsonwebtoken');



function authenticateToken(req, res, next) {
    const token = req.cookies.authToken;

    res.setHeader('Catch-Control', 'no-sotre');

    if(!token) {
        return res.redirect('/login?Please_log_in');
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if(err) {
            res.clearCookie('authToken');
            return res.redirect('/login?Session_expired');
        }

        req.user = user;
        next();
    });
};


module.exports = authenticateToken;