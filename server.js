const express = require("express");
const app = express();
const cors = require('cors');
const mysql = require('promise-mysql');
const bodyParser = require("body-parser");
const eventsData = require("./server/route");

require("date-format-lite");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const port = 3000; 

var db = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"1997anna",
    database: "scheduler6"
});

app.get("/events", eventsData.getAllData);
app.post("/events/", eventsData.addEvent);
app.put("/events/:id", eventsData.updateEvent);
app.delete("/events/:id", eventsData.deleteEvent);

app.listen(port, ()=>{
    console.log("Server was start...");
});

module.exports.db = db;
