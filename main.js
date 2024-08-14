var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

var db = new sqlite3.Database('activity.db');
db.serialize(function() {
  db.run('CREATE TABLE IF NOT EXISTS activities (activity TEXT, time TEXT)');
});

function registerActivity(activity) {
  let sql = 'INSERT INTO activities (activity, time) VALUES (?, ?)';
  let values = [activity, new Date()];
  db.run(sql, values);
}

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/stats', function(req, res) {
  let sql = 'SELECT * FROM activities';
  db.all(sql, function(err, rows) {
    res.json(rows);
  });
});

app.post('/activity', function(req, res) {
  console.log(req.body);
  registerActivity(req.body.activity);
  res.redirect('/');
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});
