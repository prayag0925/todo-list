const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// tasks list
var taskList = [
    { id: 1, title: "Prepare Report", description: "Complete weekly project report", priority: "High", status: "Pending" },
    { id: 2, title: "Team Meeting", description: "Attend standup meeting at 10 AM", priority: "Medium", status: "In Progress" },
    { id: 3, title: "Code Review", description: "Review pull requests from teammates", priority: "Low", status: "Completed" }
]

var nextId = 4

// home page - dashboard
app.get('/', function (req, res) {

    var total = taskList.length
    var pending = 0
    var inprogress = 0
    var completed = 0

    for (var i = 0; i < taskList.length; i++) {
        if (taskList[i].status == "Pending") {
            pending++
        } else if (taskList[i].status == "In Progress") {
            inprogress++
        } else if (taskList[i].status == "Completed") {
            completed++
        }
    }

    var message = ""
    if (req.query.msg) {
        message = req.query.msg
    }

    res.render('dashboard', {
        tasks: taskList,
        total: total,
        pending: pending,
        inprogress: inprogress,
        completed: completed,
        msg: message
    })
})

// add task page
app.get('/add-task', function (req, res) {
    res.render('add-task', { error: "" })
})

app.post('/add-task', function (req, res) {

    var title = req.body.title
    var description = req.body.description
    var priority = req.body.priority


    if (!title || !description || !priority) {
        res.render('add-task', { error: "All fields are required!" })
        return
    }

    var newTask = {
        id: nextId,
        title: title,
        description: description,
        priority: priority,
        status: "Pending"
    }

    taskList.push(newTask)
    nextId++

    res.redirect('/?msg=Task added successfully!')
})

// edit task page
app.get('/edit-task/:id', function (req, res) {

    var id = parseInt(req.params.id)
    var foundTask = null

    for (var i = 0; i < taskList.length; i++) {
        if (taskList[i].id == id) {
            foundTask = taskList[i]
        }
    }

    if (foundTask == null) {
        res.redirect('/')
        return
    }

    res.render('edit-task', { task: foundTask, error: "" })
})

app.post('/edit-task/:id', function (req, res) {

    var id = parseInt(req.params.id)
    var title = req.body.title
    var description = req.body.description
    var priority = req.body.priority
    var status = req.body.status

    if (!title || !description || !priority) {

        var foundTask = null
        for (var i = 0; i < taskList.length; i++) {
            if (taskList[i].id == id) {
                foundTask = taskList[i]
            }
        }

        res.render('edit-task', { task: foundTask, error: "All fields are required!" })
        return
    }

    for (var i = 0; i < taskList.length; i++) {
        if (taskList[i].id == id) {
            taskList[i].title = title
            taskList[i].description = description
            taskList[i].priority = priority
            taskList[i].status = status
        }
    }

    res.redirect('/?msg=Task updated successfully!')
})

// delete task
app.post('/delete/:id', function (req, res) {

    var id = parseInt(req.params.id)
    var newList = []

    for (var i = 0; i < taskList.length; i++) {
        if (taskList[i].id != id) {
            newList.push(taskList[i])
        }
    }

    taskList = newList
    res.redirect('/?msg=Task deleted!')
})

app.post('/update-status/:id', function (req, res) {

    var id = parseInt(req.params.id)

    for (var i = 0; i < taskList.length; i++) {
        if (taskList[i].id == id) {
            if (taskList[i].status == "Pending") {
                taskList[i].status = "In Progress"
            } else if (taskList[i].status == "In Progress") {
                taskList[i].status = "Completed"
            }
        }
    }

    res.redirect('/?msg=Status updated!')
})

app.listen(3000, function () {
    console.log("Server started on http://localhost:3000")
})