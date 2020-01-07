// import STATUS from './constant';

const express = require('express');
const mysql = require('mysql');
// const dbconfig = require('./constant');
var cors = require('cors')
const bodyParser = require('body-parser');

const dbconfig = {
    host: "localhost",
    user: "root",
    password: "",
    port: "3306"
}

const STATUS = {
    success: "success",
    error: "error"
}

var app = express();
var database = mysql.createConnection(dbconfig);


app.use(cors());
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});
app.use(bodyParser.urlencoded({ extended: false }));

app.start
// app.writeHead(200, {
//     'Content-Type': 'text/plain',
//     'Access-Control-Allow-Origin' : '*',
//     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
// })

database.connect((err) => {
    console.log(err);
});

database.query("use student");

app.get("/", (req, res) => {
    res.send({ message: "welcome" })
})

app.get("/students", (req, res) => {
    const query = "SELECT * from student";
    let response = {
        status: STATUS.success,
        data: null
    }

    try {
        dbresponse = database.query(query, (err, dbres) => {
            err ? response.status = STATUS.error : STATUS.success;
            response.data = JSON.stringify(dbres);
            response.data = dbres;
            console.log(err);
            console.log(dbres);
            responseHandler(res);
            res.send(response);
        });
    } catch{
        response.status = STATUS.error
        res.send(response);
    }
});

app.post("/student/:id", (req, res) => {
    responseHandler(res);
    const query = "SELECT * from student Where id = ?";
    let id = req.params;
    var body = req.body;
    var values = [body.id]
    console.log("req", req);
    let response = {
        status: STATUS.success,
        data: null
    }
    if (!body && !body.id) {
        response.status = STATUS.error;
        res.send(response);
    } else {
        try {
            dbresponse = database.query(query, values, (err, dbres) => {
                err ? response.status = STATUS.error : STATUS.success;
                response.data = JSON.stringify(dbres);
                response.data = dbres;
                console.log(err);
                console.log(dbres);
                res.send(response);
            });
        } catch{
            response.status = STATUS.error;
            res.send(response);
        }


    }
})

app.post("/student/edit", (req, res) => {
    console.log(req);
    responseHandler(res);
    let response = {
        status: STATUS.success,
        data: null,
    }

    var query = "update student set name = ?, email = ?, mobile = ?, dob = ?, rollNumber = ?, class = ? where id = ?";

    var body = req.body;
    console.log("", body);
    var values = [body.name, body.email, body.mobile, body.dob, body.rollNumber, body.class, body.id];
    try {
        database.query(query, values, (err, dbres) => {
            console.log(err);
            console.log(dbres);
            err ? response.status = STATUS.error : STATUS.success;
            if (!err) {
                response.data = dbres;
                response.status = dbres && dbres.changedRows > 0;
            }
            res.send(response);
        });
    } catch {
        response.status = STATUS.error;
        res.send(response);
    }

});

app.post("/add-student", (req, res) => {
    console.log(req);
    responseHandler(res);
    let response = {
        status: STATUS.error.success,
        data: null
    }
    var query = "insert into student(name, email, mobile, dob, rollNumber, class, id) value(?,?,?,?,?,?,?)";
    var body = req.body;
    var values = [body.name, body.email, body.mobile, body.dob, body.rollNumber, body.class, Math.random()];
    try {
        database.query(query, values, (err, dbres) => {

            err ? response.status = STATUS.error : STATUS.success;
            console.log(err);
            console.log(dbres);
            response.data = dbres;
            res.send(response);
        });
    } catch {
        response.status = STATUS.error;
        res.send(response);
    }

});

var responseHandler = (res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    // res.writeHead(200, {
    //     'Content-Type': 'text/plain',
    //     'Access-Control-Allow-Origin' : '*',
    //     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
    // });
}

app.post("/delete-student", (req, res) => {
    console.log(req);
    responseHandler(res);
    let response = {
        status: "success",
        data: null
    }
    var query = "DELETE from student where id = ?";
    let body = req.body;
    var values = [body.id];
    try {
        database.query(query, values, (err, dbres) => {
            response.data = dbres;
            res.send(response);
        });
    } catch {
        response.status = STATUS.error;
        res.send(response);
    }
   
});
app.listen(3000, () => {
    console.log("app is runnig")
})