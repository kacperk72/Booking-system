const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const fetch = require('node-fetch');
const fs = require('fs');
// var DataBase = require('./database/db.js');
var script = require('./import.js');
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

app.route('/room-info/:id').get(function(req, res) {
    DataBase.getRoomInfo(req.params.id, function(err, result) {
        res.send(result);
    });
});

app.route('/add-room').post(function(req, res) {
    DataBase.insertRoom(req.body.salaId, req.body.seats, req.body.name);
});

app.route('/admin/reservation-list').get(function(req, res) {
    DataBase.getReservations(function(err, result) {
        res.send(result);
    });
});

app.route('/add-reservation').post(function(req, res) {
    DataBase.insertReservation(req.body.userId,
        req.body.salaId,
        req.body.mail,
        req.body.course,
        req.body.start,
        req.body.end,
        req.body.acceptationState);
});

app.route('/filter-rooms').get((req, res) => {
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

app.route('/admin/reservation').put( (req,res) => {
    const userId = req.body.userId;
    const acceptationState = req.body.acceptationState;
    DataBase.accept_or_reject_reservation(acceptationState, userId);
    res.status(200).send(`state of reservation ${userId} has changed to ${acceptationState} succesfully`);
})
// to dodałem
app.route('/addToDb').get((req, res) =>{

    fetch('http://localhost:8001/data')
        .then(response => response.json())
        .then(data => {
            // to wyswietla, ponizej pomiedzy komentarzami jak rozumie dodadnie do bazy
            console.log(JSON.stringify(data))
            //


            //
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Błąd pobrania danych');
        });
});

