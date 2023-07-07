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
const mail = require("./send_mails.js");
require('dotenv').config();
var conflictDataStable = [];


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
                    } 
                    else {
                        await DataBase.insertReservation(item.id, "Empty", item.name_pl, item.start_time, item.end_time, 'USOS');
                    }
                }
            }
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
app.route('/addToDb').get(async (req, res) => {
    var count = 0;
    let numbers = [];
    try {
        numbers = await roomIDs.getRoomIDs();

        const addReservationsToDb = async function() {
            const response = await fetch('http://localhost:8001/data');
            const data = await response.json();
            const parsedData = JSON.parse(data);
            for (const firstTable of parsedData) {
                for (const item of firstTable) {
                    await DataBase.insertReservation(item.id, "Empty", item.name_pl, item.start_time, item.end_time, 'USOS');
                }
            }
        };

        const addRoomsToDb = async function(numbers) {
            for (const item of numbers) {
                const response = await fetch(`https://apps.usos.uj.edu.pl/services/geo/room?room_id=${item}&fields=number|type|capacity`);
                const data = await response.json();
                const parsedData = JSON.parse(JSON.stringify(data));
                if (parsedData.type === "didactics_room")
                    parsedData.type = "dydaktyczna"
                if (parsedData.capacity > 50 && parsedData.type === "dydaktyczna")
                    parsedData.type = "wykładowa"
                if ((parsedData.number[0] === "F" || parsedData.number[0] === "G") && parsedData.type === "dydaktyczna")
                    parsedData.type = "komputerowa"
                else if (parsedData.type === "staff_members_room")
                    parsedData.type = "pokój personelu"
                await DataBase.insertRoom(item, parsedData.capacity, parsedData.number, parsedData.type);
            }
        };

        await addRoomsToDb(numbers);
        await addReservationsToDb();

        res.send('Dane dodane do bazy');
    } catch (err) {
        console.error(err);
        res.status(500).send('Błąd pobrania danych');
    }
});


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



// app.route('/addToDb').get((req, res) =>{
//     var count = 0;
//     let numbers = [];
//     (async () => {
//         numbers = await roomIDs.getRoomIDs();
       
//         const addRoomsToDb = function(numbers, callback) {
//             numbers.forEach(async (item) => {
//                 await fetch(`https://apps.usos.uj.edu.pl/services/geo/room?room_id=${item}&fields=number|type|capacity`)
//                 .then(response => response.json())
//                 .then(data => {
//                     const parsedData = JSON.parse(JSON.stringify(data));
//                     DataBase.insertRoom(item, parsedData.capacity, parsedData.number, parsedData.type);
//                 })
//                 .catch(err => {
//                     console.error(err);
//                 });
//             });
//             callback();
//         };
//         const addReservationsToDb = function() {
//             fetch('http://localhost:8001/data')
//             .then(response => response.json())
//             .then(data => {
                
//                 const parsedData = JSON.parse(data);
            

//                 parsedData.forEach(firstTable => {
//                     firstTable.forEach(item => {
//                         console.log(item.name_pl);
//                         DataBase.insertReservation(item.id, "Empty", item.name_pl, item.start_time, item.end_time, 'pending');
//                     });
//                 });
//             })
//             .catch(err => {
//                 console.error(err);
//                 res.status(500).send('Błąd pobrania danych');
//             });
//         };
//         addRoomsToDb(numbers, addReservationsToDb);
//     })();
// });




