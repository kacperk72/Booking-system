var connection = require('./connection.js');


// propozycja klasy rezerwacji:

var DataBase = {
    getRooms: function (callback) {
        connection.query('SELECT * FROM sale', function (err, result) {
            if (err) {
                console.log("Error while listing rooms");
            } else {
                callback(err, result);
            }
        });
    },
    getRoomInfo: function (id, callback) {
        connection.query(`SELECT * FROM sale WHERE SalaID = ${id}`, function (err, result) {
            if (err) {
                console.log(`Error while getting info about room of id ${id}`);
            } else {
                callback(err, result);
            }
        });
    },
    insertRoom: function (id, seats, name, type) {
        var sql = `INSERT INTO sale (SalaID, IloscMiejsc, NazwaSali, TypSali) VALUES (${id}, ${seats}, '${name}', '${type}') ON DUPLICATE KEY UPDATE IloscMiejsc = ${seats}, NazwaSali = '${name}', TypSali = '${type}'`;
        connection.query(sql, function (err, result) {
            if (err) {
                console.log("Can't insert room");
            } else {
                console.log("Inserted one row");
            }
        });
    },
    getFilteredRooms: function (name = "", number_of_seats = 0, date = "", callback) {
        let number_of_seats_step = number_of_seats === 0 ? 140 : 10
        const sql = `SELECT DISTINCT NazwaSali FROM sale NATURAL JOIN rezerwacje WHERE
            sale.IloscMiejsc BETWEEN ${number_of_seats} AND ${number_of_seats + number_of_seats_step}
            AND sale.NazwaSali LIKE '%${name}%'
            AND rezerwacje.Data LIKE '%${date}%'`;
        connection.query(sql, function (err, result) {
            if (err) {
                console.log("Can't filter data");
            } else {
                console.log("Data filtered");
                callback(err, result);
            }
        });
    },
    getReservations: function (callback) {
        connection.query('SELECT * FROM rezerwacje', function (err, result) {
            if (err) {
                console.log("Error while listing reservations");
            } else {
                callback(err, result);
            }
        });
    },
    insertReservation: function (sala_id, mail, course, start, end, acceptation) {
        var sql = `INSERT INTO rezerwacje (SALA_ID, Mail, NazwaPrzedmiotu, DataStartu, DataKonca, Potwierdzenie) VALUES (${sala_id}, '${mail}', '${course}', '${start}', '${end}', '${acceptation}')`;
        connection.query(sql, function (err, result) {
            if (err) {
                console.log("Can't insert reservation");
            } else {
                console.log("Inserted one row");
            }
        });
    },
    accept_or_reject_reservation: function (acceptationState = 'rejected', rezerwacjaId) {
        const sql_query = 'UPDATE rezerwacje SET Potwierdzenie = ? WHERE RezerwacjaID = ?'
        connection.query(sql_query, [acceptationState, rezerwacjaId], (err, result) => {
                if (err) throw err;
                // console.log(`state of reservation ${rezerwacjaId} has changed to ${acceptationState}`)
            }
        )
    }

};

module.exports = DataBase;
