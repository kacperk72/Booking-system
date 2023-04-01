const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

var DataBase = require('./database/db.js');

var app = express();

app.listen(3000);

app.use(cors({
    origin: 'http://localhost:4200',
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.route('/room-list').get(function(req, res) {
    DataBase.getRooms(function(err, result) {
        res.send(result);
    });
});

app.route('/add-room').post(function(req, res) {
    DataBase.insertRoom(req.body.id, req.body.seats, req.body.name);
});

app.route('/filter-rooms').post((req, res) => {
    const name = req.body.name;
    const seats = req.body.seats;
    const date = req.body.date;
    DataBase.getFilteredRooms(name, seats, date, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(result);
        }
    });
});
