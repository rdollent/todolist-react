// require express and router to connect to app.js
var express = require("express");
var router = express.Router();

// require todo schema
// "../" will move you up one directory
var Todo = require("../models/todoModel");

// require middleware
// if we require only ""../middleware" it will automatically look for index.js
var middleware = require("../middleware/index.js");

// note: res.render looks for views folder.
// to change where you want views to be
// app.set('views','./folder1/folder2/views');

// index route - show all todos
router.get("/", middleware.isLoggedIn,function(req,res) {
    // Get all todos from db
    // get only author's unique todos! :)
    Todo.find({ "author.id" : req.user._id}, function(err, allTodos) {
        if(err) {
            console.log(err);
        } else {
            res.render("todo/index", {todos: JSON.stringify(allTodos)});
        }
    });
    
});

// for overlapping hours
// Todo.find({}, "frmHr toHr", function(err, foundHours) {
//     if(err) return console.log(err);
//     var storedHours = [];
//     var toFrmHrs = [];
//     for(var i=0; i < foundHours.length;i++) {
//       toFrmHrs.push(parseInt(foundHours[i].frmHr));
//       toFrmHrs.push(parseInt(foundHours[i].toHr));
//       storedHours.push(toFrmHrs);
//       toFrmHrs = [];
//     }
// });

// get route for specific date


// create route
router.post("/", middleware.isLoggedIn, function(req, res) {
    // console.log(req.body);
    // store values in vars
    var year = req.body.year;
    var month = req.body.month;
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
    
    // create range for times
    // var frmHrInt = parseInt(frmHr);
    // var toHrInt = parseInt(toHr);
    // var timeRange = [];
    
    // for(var i = frmHrInt; i < toHrInt; i++) {
    //     timeRange.push(i);
    // }
    
    
    // Todo.find({}, "frmHr toHr", function(err, foundHours) {
    //     if(err) return console.log(err);
    //     console.log(foundHours);
    // });
    
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
router.get("/:id", middleware.isLoggedIn, function(req, res) {
    Todo.findById(req.params.id, function(err, foundTodo) {
        if(err) {
            console.log(err);
            res.redirect("/");
        } else {
            res.render("todo/show", {todo: foundTodo});
        }
    });
});

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
    Todo.findByIdAndUpdate(req.params.id, req.body.todo, function(err, updatedTodo) {
        if(err) {
            console.log(err);
            res.redirect("/todo");
        } else {
            res.redirect("/todo/" + req.params.id);
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
