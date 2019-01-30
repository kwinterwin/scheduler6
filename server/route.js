var Promise = require('bluebird');
var db = require("../server");

var events = {

    getAllData(req, res){
        Promise.all([
            db.db.query("SELECT * FROM events"),
            db.db.query("select employee_id as futureKey, name as label from employees")
        ]).then(function(results){
            var events = results[0],
            employees = refreshDataKey(results[1]);
         
            for (var i = 0; i < events.length; i++) {
                events[i].start_date = events[i].start_date.format("YYYY-MM-DD hh:mm:ss");
                events[i].end_date = events[i].end_date.format("YYYY-MM-DD hh:mm:ss");
            }

            res.send({
                data: events,
                collections: {
                    employees: employees
                }
            });
         
        }).catch(function(error) {
            console.log(error);
        });
    },

    addEvent(req, res){
        var event = req.body;  
    
        db.db.query("INSERT INTO events(start_date, end_date, title, text, type, location, progress, priority, isShare, reccuring)"
            + " VALUES (?,?,?,?,?,?,?,?,?,?)", 
            [event.start_date, event.end_date, event.text, event.title, event.type, event.location, Number(event.progress), Number(event.priority), event.isShare, event.reccuring])
        .then (function (result) {
            res.json({"action":"inserted", "tid": result.insertId});
        })
        .catch(function(error) {
            console.log(error);
        });
    },

    updateEvent(req, res){  
        var event = req.body;
        var event_id = req.params.id;
        db.db.query("UPDATE events SET start_date = ?, end_date = ?, "
            + "title = ?, type = ?, isShare = ?, text = ? WHERE id = ?",
            [event.start_date, event.end_date, event.title, event.type, event.isShare, event.text, event_id])
        .then (function(result) {
            res.json({"action":"updated"});
        })
        .catch(function(error) {
            console.log(error);
        });
    },

    deleteEvent(req, res){
        var sid = req.params.id;
        db.db.query("DELETE FROM gantt_tasks WHERE id = ?", [sid])
        .then (function (result) {
            res.json({"action":"deleted"});
        })
        .catch(function(error) {
            console.log(error);
        });
    }
};

function refreshDataKey(array){
    for(var i = 0; i < array.length; i++){
        array[i].key = array[i].futureKey;
        delete array[i].futureKey;
    }
    return array;
}

module.exports = events;
 