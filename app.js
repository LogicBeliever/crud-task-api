const express = require("express");
const app = express();

const mongoose = require('./database/mongoose')

const TaskList = require('./database/models/taskList');
const Task = require('./database/models/task');


// where http request for browser understanding
// *** EXMAPLE OF MIDDLEWARE ***
app.use(express.json()); // body parser *Third party library

/*
          !!!      app.use(cors())  // cors is a third party library for cross origin resource sharing  !!!
*/

/*
CORS - Cross Origin Resource SECURITY
BACKEND - http:localhost:3000               
FRONTEND - http:localhost:4200
*/
app.use( function(req, res, next){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// where http request for browser understanding
// *** EXMAPLE OF MIDDLEWARE ***
app.use(express.json()); // body parser *Third party library




/*

            API endpoints


*/
// Routers of rest api endpoints / web servises

/*
TaskList  -----> Create, Update, ReadTaskListById, ReadAllTaskList
Task ----------> Create , Update, ReadTaskById, ReadAllTask
*/

//   1. For TaskList model        

//   1.1 Get all Task Lists ------>  http://localhost:3000/tasklists
//  Result: -----------------------> [{TaskList}, {TaskList}]
// restapitutorial.com

//////////       MOST IMPORTSNT PART OF THESE API'S IS THAT
//////////      WE NEED TO FOLLOW STATUS CODES OF HTTP REQUESTS

app.get('/tasklists', (req,res) =>{
    TaskList.find({})
        .then((lists) => {
            //res.send(lists)
            res.status(200).send(lists)  // 200 is status code of http request
        })
        .catch((error)=>{
            console.log(error);
            res.status(500);
        });
});

// same same but different in synatax
/*
app.get('/tasklist',function(req, res){
    TaskList.find({})
        .then(function(lists){
            res.send(lists)                 //not consider 
        })                                  // beacuse comment
        .catch(function(error){
            console.log(error)
        })
});

*/

////////// MOST IMPORTSNT PART OF THESE API'S IS THAT
////////// WE NEED TO FOLLOW STATUS CODES OF HTTP REQUESTS

// rout or endpoint for creating a TaskList
app.post('/tasklists', (req, res) =>{
    console.log("I'm inside: means post request is working ");
    console.log(req.body);
    let taskListObj = { 'title': req.body.title};
    TaskList(taskListObj).save()
        .then((tasklist) =>{
            //res.send(tasklist)         * makes error in postman because it is not following status code of http request
            //res.status(201)
            res.status(201).send(tasklist)

        })
        .catch((error)=>{
            console.log(error)
            res.status(500); //http.send(error)
        });
});

////////// MOST IMPORTSNT PART OF THESE API'S IS THAT
////////// WE NEED TO FOLLOW STATUS CODES OF HTTP REQUESTS



// rout or endpoint to get one tasklist by tasklist id
// http://localhost:3000/tasklists/5e7f8f8f8f8f8f8f8f8f8f8
app.get(
    '/tasklists/:tasklistId', (req, res) =>{
        let tasklistId = req.params.tasklistId;
        TaskList.find({_id: tasklistId})
            .then((tasklistId) => {
                res.status(200).send(tasklistId)
            })
            .catch((error) => {
                console.log(error);
                res.status(500);
            });
    }
);

// put is full update of object 
app.put('/tasklists/:tasklistId/',(req,  res) => {
    TaskList.findOneAndUpdate({_id: req.params.tasklistId}, { $set: req.body})
            .then((tasklistId) => {
                res.status(200).send(tasklistId)
            })
            .catch((error) => {
                console.log(error);
                res.status(500);
            });
});

// patch is partial update of object
app.patch('/tasklists/:tasklistId/',(req,  res) => {
    TaskList.findOneAndUpdate({_id: req.params.tasklistId}, { $set: req.body})
            .then((tasklistId) => {
                res.status(200).send(tasklistId)
            })
            .catch((error) => {
                console.log(error);
                res.status(500);
            });
});

// Delete a tasklist by id
app.delete('/tasklists/:tasklistId/',(req,  res) => {
    TaskList.findByIdAndDelete(req.params.tasklistId)
            .then((taskList) => {
                res.status(201).send(taskList)
            })
            .catch((error) => {
                console.log(error);
                res.status(500);
            });
});

/*

|++++++++++++++++++++++++++++++++++++++++++++++
|    
|   CRUD OPRATION FOR TASK MODEL
|    A TASK SHOULE BELONG TO A TASKLIST
|
|++++++++++++++++++++++++++++++++++++++++++++++

*/
// for one task
// http://localhost:3000/tasklists/:tasklistId/tasks/:taskId
app.get('/tasklists/:tasklistId/tasks',( req, res)  => {
    Task.find({ _taskListId: req.params.tasklistId })
            .then((tasks) => {
                res.status(200).send(tasks)
            })
            .catch((error) => {
                console.log(error);
                res.status(500);
            });
});


// create a task for a tasklist
app.post(
    '/tasklists/:tasklistId/tasks', (req, res) => {
        console.log(req.body);

        let taskObj ={ 'title': req.body.title, '_taskListId': req.params.tasklistId};
        Task(taskObj).save()
            .then((task) => {
                res.status(201).send(task);
            })
            .catch((error) => {
                console.log(error);
                res.status(500);
            });
});


// get 1 task inside 1 tasklist
app.get('/tasklists/:tasklistId/tasks/:taskId',( req, res)  => {
    Task.findOne({ _taskListId: req.params.tasklistId, _id: req.params.taskId })
            .then((task) => {
                res.status(200).send(task)
            })
            .catch((error) => {
                console.log(error);
                res.status(500);
            });
});


// update 1 task inside 1 tasklist
app.patch('/tasklists/:tasklistId/tasks/:taskId',(req,  res) => {
    Task.findOneAndUpdate({_taskListId: req.params.tasklistId, _id: req.params.taskId}, 
    { $set: req.body})
            .then((task) => {
                res.status(200).send(task)
            })
            .catch((error) => {
                console.log(error);
                res.status(500);
            });
});

// delete 1 task inside 1 tasklist
app.delete('/tasklists/:tasklistId/tasks/:taskId',(req,  res) => {
    Task.findOneAndDelete({_taskListId: req.params.tasklistId, _id: req.params.taskId}, 
    { $set: req.body})
            .then((task) => {
                res.status(200).send(task)
            })
            .catch((error) => {
                console.log(error);
                res.status(500);
            });
});

// app.listen(3000, function(){console.log("Server started on port 3000");});
app.listen(3000, () =>{
    console.log("Server running on port no 3000 ");
});