var express = require("express");
var router = express.Router();

// need User for register
// ../ moves two folders up
var User = require("../models/userModel.js");

// for auth
var passport = require("passport");

// Routes
router.get("/", function(req, res) {
    res.render("home");
});

// router.get("/about", function(req,res) {
//     res.render("about");
// });


// Authentication Routes

// register form
router.get("/register", function(req, res) {
    res.render("register");
});

// handle signup logic
router.post("/register", function(req, res) {
    // get username from signup form
    var newUser = new User({username: req.body.username});
    // we don't save passwords in database. Hash the password
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/todo");
            });
        }
    });
});

// login form
router.get("/login", function(req, res) {
    res.render("login");
});

// handle login logic
// "/login", middleware, callback
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/todo",
        failureRedirect: "/login"
    }), function(req, res) {
    // callback does not do anything. can remove if want to.
});

// logout
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});


module.exports = router;