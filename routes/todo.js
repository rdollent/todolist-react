// require express and router to connect to app.js
var express = require("express");
var router = express.Router();

// require todo schema
// "../" will move you up one directory
var Todo = require("../models/todoModel");

// require middleware
// if we require only ""../middleware" it will automatically look for index.js
var middleware = require("../middleware/index.js");

//monthArray to convert received string to number before storing
var monthArr = ["January", "February", "March", "April",
                "May", "June", "July", "August",
                "September", "October", "November", "December"];

// note: res.render looks for views folder.
// to change where you want views to be
// app.set('views','./folder1/folder2/views');

// noteL root "/" is actually "todo/"
// index route - show all todos
router.get("/", middleware.isLoggedIn,function(req,res) {
    // Get all todos from db
    // get only author's unique todos! :)

    // Todo.find({ "author.id" : req.user._id},
    //     "date description frmHr frmMin month title toHr toMin year _id",
    //     function(err, allTodos) {
    //     if(err) {
    //         console.log(err);
    //     } else {
    //         res.render("todo/index", {todos: JSON.stringify(allTodos)});
    //     }
    // });
    
    // start of xmlhttp request
    // console.log(req.user._id);
    res.render("todo/index", {user: JSON.stringify(req.user._id)});
});

// xmlhttprequest get todos given userid
router.get("/user/:userid", middleware.isLoggedIn, function(req,res) {
    Todo.find({"author.id" : req.params.userid},
        "date description frmHr frmMin month title toHr toMin year _id",
        function(err, allTodos) {
            if(err) {
                console.log(err);
            } else {
                res.send(allTodos);
            }
    });
});



// create route
router.post("/", middleware.isLoggedIn, function(req, res) {
    // console.log(req.body);
    // store values in vars
    var year = req.body.year;
    var month = monthArr.indexOf(req.body.month);
    var date = req.body.date;
    var title = req.body.title;
    var description = req.body.description;
    var frmHr = req.body.frmHr;
    var frmMin = req.body.frmMin;
    var toHr = req.body.toHr;
    var toMin = req.body.toMin;
    // req.user cannot be empty because of isLoggedIn
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    // create new todo using title,description from body
    var newTodo = {
        year: year,
        month: month,
        date: date,
        title: title, 
        description: description, 
        frmHr: frmHr,
        frmMin: frmMin,
        toHr: toHr,
        toMin: toMin,
        author: author
        };

    
    Todo.create(newTodo, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            // redirect back to todo index
            res.redirect("/todo");
        }
    });
});



// new todo
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("todo/new");
});

// show route
// router.get("/:id", middleware.isLoggedIn, function(req, res) {
//     Todo.findById(req.params.id, function(err, foundTodo) {
//         if(err) {
//             console.log(err);
//             res.redirect("/");
//         } else {
//             res.render("todo/show", {todo: foundTodo});
//         }
//     });
// });

// Edit route
router.get("/:id/edit", middleware.isLoggedIn, function(req,res) {
    Todo.findById(req.params.id, function(err, foundTodo) {
        if(err) {
            console.log(err);
        } else {
            res.render("todo/edit.ejs", {todo: foundTodo});
        }
    });
});

// Update route
router.put("/:id", middleware.isLoggedIn, function(req, res) {
    // change req.body.todo.month string to number
    var month = monthArr.indexOf(req.body.todo.month);
    req.body.todo.month = month;
    Todo.findByIdAndUpdate(req.params.id, req.body.todo, function(err, updatedTodo) {
        if(err) {
            console.log(err);
            res.redirect("/todo");
        } else {
            res.redirect("/todo/");// + req.params.id);
        }
    });
});

// delete route
router.delete("/:id", middleware.isLoggedIn, function(req, res) {
    Todo.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log(err);
            res.redirect("/todo");
        } else {
            res.redirect("/todo");            
        }

    });
});

// NOTE: since variables are type: Number in todoModel.js, "01" automatically becomes 1 when saved.

// export this whole file to app.js
module.exports = router;
