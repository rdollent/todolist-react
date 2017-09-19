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
    if(req.user) {
        res.redirect("/todo");
    } else {
        res.render("register");
    }
});

// handle signup logic
router.post("/register", function(req, res) {
    // get username from signup form
    var newUser = new User({username: req.body.username});
    // we don't save passwords in database. Hash the password
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            // the normal flash does not work (for some reason)
            // req.flash("error", err.message);
            return res.render("register", {"error": err.message});
        } else {
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Welcome to the To-Do App, " + user.username + "!");
                res.redirect("/todo");
            });
        }
    });
});

// login form
router.get("/login", function(req, res) {
    if(req.user) {
        res.redirect("/todo");
    } else {
        res.render("login");
    }
});

// handle login logic
// "/login", middleware, callback
// router.post("/login", passport.authenticate("local",
//     {
//         successRedirect: "/todo",
//         failureRedirect: "/login",
//         failureFlash: true
//     }), function(req, res) {
//     // callback does not do anything. can remove if want to.
// });


//login logic from udemy
router.post("/login", function(req, res, next){
    passport.authenticate("local", function(err, user, info){
        // console.log(user);
        // console.log("======================");
        // console.log(info);
        if(err){
            return next(err);
        } if(!user) {
            req.flash("error", "Username or password is incorrect.");
            return res.redirect("/login");
        }
        req.logIn(user, function(err){
            if(err){
                return next(err);
            }
            // var redirectTo = req.session.redirectTo ? req.session.redirectTo: "/todo";
            // delete req.session.redirectTo;
            req.flash("success", "Welcome back!");
            res.redirect("/todo");
        });
    })(req,res,next);
});

// logout
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});


module.exports = router;