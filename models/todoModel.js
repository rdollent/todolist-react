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
    frmHr: Number, 
    frmMin: Number,
    toHr: Number, 
    toMin: Number,
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