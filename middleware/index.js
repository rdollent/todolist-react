// all middleware goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    // Authentication
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
};

module.exports = middlewareObj;