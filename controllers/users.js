const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
    res.render("users/register");
}
module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({
            username: username,
            email: email
        })
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, e => {
            if (e)
                return next(e);
            req.flash("success", "Welcome to Yelp-Camp");
            res.redirect("/campgrounds");
        })
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }

}
module.exports.renderLogin = (req, res) => {
    res.render("users/login");
}
module.exports.login = (req, res) => {
    const url = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    req.flash("success", `Welcome back ${req.user.username} `);
    res.redirect(url);
}
module.exports.logout = (req, res) => {
    const loggedoutUser = req.user.username;
    req.logout();
    req.flash("success", `Goodbye ${loggedoutUser} !Looking forward to seeing you at Yelp-Camp!`);
    res.redirect("/campgrounds");
}