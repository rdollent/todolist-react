var mongoose = require("mongoose");

// Schema setup
var todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    description: String,
    year: Number,
    month: Number,
    date: Number,
    frmHr: String, 
    frmMin: String,
    toHr: String, 
    toMin: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" 
        },
        username: String
    }
});

var Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;