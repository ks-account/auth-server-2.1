exports.loginPage = (req, res) => {
    console.log("This is the current server url saved in .env: ", process.env.SELF_URL);
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