const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
var DataBase = require('./database/db.js');
var Import = require('./import.js');
var app = express();
const mail = require("./send_mails.js");
require('dotenv').config();
var conflictDataStable = [];
var connection = require('./database/connection.js');
var variable = false;

app.listen(3000);

app.use(cors({
    origin: 'http://localhost:4200',
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.route('/getconflicts').get(function(req, res) {
    res.send(conflictDataStable)
    conflictDataStable.splice(0, conflictDataStable.length);
});

app.route('/reimport').get(async (req, res) => {
    try {
        DataBase.deleteUsosReservation()
        const conflictData = await reimportDb();
        res.send(conflictData);
    } catch (err) {
        console.error(err);
        res.status(500).send('Błąd pobrania danych');
    }
});

async function reimportDb() {
    const conflictData = [];
    try {
        await Import.getReservations()
        const response = await fetch('http://localhost:8001/data');
        const data = await response.json();
        const parsedData = JSON.parse(data);



        for (const firstTable of parsedData) {
            for (const item of firstTable) {
                const existingData = await findByIdAndStartTime(item.id, item.start_time);
                if (existingData) {
                    const conflict = {
                        existingData: existingData,
                        newItem: {
                            SALA_ID: item.id,
                            Mail: 'empty',
                            NazwaPrzedmiotu: item.name_pl,
                            DataStartu: new Date(item.start_time).toISOString(),
                            DataKonca: new Date(item.end_time).toISOString(),
                            Potwierdzenie: 'pending'
                        }
                    };
                    conflictData.push(conflict);
                    conflictDataStable.push(conflict);
                } else {
                    // await DataBase.insertReservation(item.id, "Empty", item.name_pl, item.start_time, item.end_time, 'USOS');
                    if (variable) {
                        var today = new Date().toISOString().split('T')[0]
                        console.log(today)
                        if (item.start_time > today){
                            await DataBase.insertReservation(item.id, "Empty", item.name_pl, item.start_time, item.end_time, 'USOS');
                        }
                    }
                    else{
                        await DataBase.insertReservation(item.id, "Empty", item.name_pl, item.start_time, item.end_time, 'USOS');
                    }
                }
            }

        }
        if(variable === false) { variable = true}
        return conflictData;
    } catch (err) {
        throw err;
    }
}

async function findByIdAndStartTime(id, startTime) {
    return new Promise((resolve, reject) => {
        DataBase.findByIdAndStartTime(id, startTime, function(err, existingData) {
            if (err) {
                reject(err);
            } else {
                resolve(existingData);
            }
        });
    });
}

app.route('/get-month-data/:month/:id').get(function(req, res) {
    const month = req.params.month;
    const id = req.params.id;
    DataBase.getReservationsForMonth(month, id, function(err, result) {
        res.send(result);
    });

});
app.route('/get-room-data/:id').get(function(req, res) {
    const id = req.params.id;
    DataBase.getReservationsForRoom(id, function(err, result) {
        res.send(result);
    });
});


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
    mail.sendReservationPendingMail()
});

app.route('/filter-rooms').get((req, res) => {
    const name = req.query.name;
    const seats = req.query.seats;
    const type = req.query.type;
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
    DataBase.getRoomScheduleByDay(id, date, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(result);
        }
    });
});

app.route('/admin/login').post(function(req, res) {
    if (req.body.login == process.env.LOGIN && req.body.password == process.env.PASSWORD) {
        res.status(200).send('Logged in');
    } else {
        res.status(401).send('Authorization failed');
    }
});

app.route('/admin/reservation').put( (req,res) => {
    const { ReservationId, acceptationState } = req.body
    DataBase.setReservationState(acceptationState, ReservationId);
    const reservation = DataBase.getReservationById(ReservationId)
    if (!reservation) res.status(204)
    res.status(200).send(`state of reservation ${ReservationId} has changed to ${acceptationState} succesfully`);
    mail.sendConfirmationMail(reservation.body.mail, acceptationState)
});

app.route('/admin/aproveRes/:id').get((req, res) => {
    const id = req.params.id; 
    DataBase.acceptReservationAdmin('accepted', id).then(result => {
        console.log("Updated reservation");
        res.status(200).send('Reservation updated successfully');
    }).catch(err => {
        console.log(err);
        console.log("Can't update reservation");
        res.status(500).send('An error occurred while trying to update the reservation');
    });
});

app.route('/admin/deleteReservation/:id').delete(async (req, res) => {
    const id = req.params.id; 
    console.log(id);
    DataBase.deleteReservationAdmin(id).then(result => {
        console.log("Deleted reservation");
        res.status(200).send('Reservation deleted successfully');
    }).catch(err => {
        console.log(err);
        console.log("Can't delete reservation");
        res.status(500).send('An error occurred while trying to delete the reservation');
    });
});
