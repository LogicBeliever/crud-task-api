/*
first we create a model for our task list,
 which will be used to store the tasks in the database.
  This model will be used to create, read, update,
   and delete tasks from the database.
*/

const mongoose = require('mongoose');

const TaskListSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        minlength: 3
    }
});

const TaskList = mongoose.model('TaskList', TaskListSchema);

module.exports = TaskList;

