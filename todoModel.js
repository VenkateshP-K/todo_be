//require mongoose
const mongoose = require("mongoose");
const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    Status: {
        type: Boolean,
        enum : ['completed', 'incomplete'],
        default: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});
const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo