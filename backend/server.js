const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');
const node_fetch = require('node-fetch');

const fetch = require('node-fetch');
const fs = require('fs');
var DataBase = require('./database/db.js');
var script = require('./import.js');
const roomIDs = require('./roomIDs.js');
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
    DataBase.insertRoom(req.body.salaId, req.body.seats, req.body.name, req.body.type);
});

app.route('/admin/reservation-list').get(function(req, res) {
    DataBase.getReservations(function(err, result) {
        res.send(result);
    });
});

app.route('/add-reservation').post(function(req, res) {
    DataBase.insertReservation(req.body.salaId,
                               req.body.mail,
                               req.body.course,
                               req.body.start,
                               req.body.end,
                               req.body.acceptationState);
});

app.route('/filter-rooms').get((req, res) => {
    const name = req.query.name;
    const seats = req.query.seats;
    const type = req.query.type;
    console.log(name + " -> " + seats + " -> " + type)  //TODO delete later
    DataBase.getFilteredRooms(name, seats, type, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(result);
        }
    });
});

app.route('/get-schedule').get((req, res) => {
    const id = req.query.id;
    const date = req.query.date;
    console.log(id + " -> " + date) //TODO delete later
    DataBase.getRoomScheduleByDay(id, date, (err, result) => {
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
});

app.route('/addToDb').get((req, res) =>{
    var count = 0;
    let numbers = [];
    (async () => {
        numbers = await roomIDs.getRoomIDs();
        // numbers.forEach(item => {
        //     console.log(item);
        // });
        const addRoomsToDb = function(numbers, callback) {
            numbers.forEach(async (item) => {
                await fetch(`https://apps.usos.uj.edu.pl/services/geo/room?room_id=${item}&fields=number|type|capacity`)
                .then(response => response.json())
                .then(data => {
                    const parsedData = JSON.parse(JSON.stringify(data));
                    DataBase.insertRoom(item, parsedData.capacity, parsedData.number, parsedData.type);
                })
                .catch(err => {
                    console.error(err);
                });
            });
            callback();
        };
        const addReservationsToDb = function() {
            fetch('http://localhost:8001/data')
            .then(response => response.json())
            .then(data => {
                // to wyswietla, ponizej pomiedzy komentarzami jak rozumie dodadnie do bazy
                // console.log(JSON.stringify(data))
                const parsedData = JSON.parse(data);
                // console.log(parsedData);
                // parsedData.forEach(firstTable => {
                //     console.log(firstTable[0]);
                //     DataBase.insertRoom(firstTable[0].id, 30, "Empty", "Empty");
                // });

                parsedData.forEach(firstTable => {
                    firstTable.forEach(item => {
                        console.log(item.name_pl);
                        DataBase.insertReservation(item.id, "Empty", item.name_pl, item.start_time, item.end_time, 'pending');
                    });
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Błąd pobrania danych');
            });
        };
        addRoomsToDb(numbers, addReservationsToDb);
    })();
});

