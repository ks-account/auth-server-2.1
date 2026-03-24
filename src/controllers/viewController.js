exports.loginPage = (req, res) => {
    res.locals.pageTitle = "Login";
    res.render('login');
};


exports.signupPage = (req, res) => {
    res.locals.pageTitle = "Signup";
    res.render('signup');
};


exports.menuPage = (req, res) => {
    res.locals.isLogoutBtn = true;
    res.locals.pageTitle = "Menu";
    res.locals.username = req.user.username;
    res.render('menu');
};