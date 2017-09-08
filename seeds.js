var mongoose = require("mongoose");
var Todo = require("./models/todoModel");
var User = require("./models/userModel");

function seedDB() {
    // remove all todos
    Todo.remove({}, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("removed all todos");
        }
    });
    
    // remove all users
    User.remove({}, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("removed all users");
        };
    });
}

module.exports = seedDB;