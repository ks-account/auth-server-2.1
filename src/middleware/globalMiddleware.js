
function globalMiddleware(req, res, next) {
    res.locals.message = "";
    next();
}


module.exports = globalMiddleware;