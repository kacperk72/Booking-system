var connection = require('./connection.js');


// propozycja klasy rezerwacji:

var DataBase = {
getReservationsForMonth: function (month, id, callback) {
    const sql = `SELECT SALA_ID, NazwaPrzedmiotu, DataStartu, DataKonca
                 FROM rezerwacje
                 WHERE MONTH(DataStartu) = ${month} AND SALA_ID = ${id}`;

    connection.query(sql, function (err, result) {
        if (err) {
            console.log(`Error while getting reservations for month ${month}`);
            callback(err, result);
        } else {
            const reservations = result;
            const salaSql = `SELECT NazwaSali
             FROM sale
             WHERE SalaId = ${id}`;

            connection.query(salaSql, function (err, salaResult) {
                if (err) {
                    console.log(`Error while getting sala names for reservations`);
                    callback(err, result);
                } else {
                    const salaName = salaResult[0].NazwaSali;
                    const reservationsWithSalaName = reservations.map((reservation) => ({
                        ...reservation,
                        NazwaSali: salaName
                    }));
                    callback(null, reservationsWithSalaName);
                }
            });
        }
    });
},
getReservationsForRoom: function (id, callback) {
    const sql = `SELECT SALA_ID, NazwaPrzedmiotu, DataStartu, DataKonca
                 FROM rezerwacje
                 WHERE SALA_ID = ${id} AND (Potwierdzenie = 'USOS' OR Potwierdzenie = 'accepted')`;

    connection.query(sql, function (err, result) {
        if (err) {
            console.log(`Error`);
            callback(err, result);
        } else {
            const reservations = result;
            const salaSql = `SELECT NazwaSali
             FROM sale
             WHERE SalaId = ${id}`;

            connection.query(salaSql, function (err, salaResult) {
                if (err) {
                    console.log(`Error while getting sala names for reservations`);
                    callback(err, result);
                } else {
                    const salaName = salaResult[0].NazwaSali;
                    const reservationsWithSalaName = reservations.map((reservation) => ({
                        ...reservation,
                        NazwaSali: salaName
                    }));
                    callback(null, reservationsWithSalaName);
                }
            });
        }
    });
},

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
        connection.query(`SELECT *
                          FROM sale
                          WHERE SalaID = ${id}`, function (err, result) {
            if (err) {
                console.log(`Error while getting info about room of id ${id}`);
            } else {
                callback(err, result);
            }
        });
    },
    insertRoom: function (id, seats, name, type) {
        var sql = `INSERT INTO sale (SalaID, IloscMiejsc, NazwaSali, TypSali)
                   VALUES (${id}, ${seats}, '${name}', '${type}') ON DUPLICATE KEY
                   UPDATE IloscMiejsc = ${seats}, NazwaSali = '${name}', TypSali = '${type}'`;
        connection.query(sql, function (err, result) {
            if (err) {
                console.log("Can't insert room");
            } else {
                // console.log("Inserted one row");
            }
        });
    },
    getFilteredRooms: function (name = '', seats = 0, type = '', callback) {
        let sql = `SELECT *
                   FROM sale
                   WHERE LOWER(sale.NazwaSali) LIKE LOWER('%${name}%')
                     AND LOWER(sale.TypSali) LIKE LOWER('%${type}%')
                     AND sale.IloscMiejsc >= '${seats}'`;
        connection.query(sql, function (err, result) {
            if (err) {
                console.log("Can't filter data");
            } else {
                callback(err, result);
            }
        });
    },
    getRoomScheduleByDay: function (id = "", date = "", callback) {
        let sql = `SELECT sale.SalaID,
                          sale.NazwaSali,
                          rezerwacje.DataStartu,
                          rezerwacje.DataKonca,
                          rezerwacje.NazwaPrzedmiotu
                   FROM sale
                            NATURAL JOIN rezerwacje
                   WHERE sale.SalaID = '${id}'
                     AND rezerwacje.DataStartu LIKE '%${date}%'`
        connection.query(sql, function (err, result) {
            if (err) {
                console.log("Can't send schedule");
            } else {
                console.log("Schedule sent");
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
        // console.log(sala_id + ' ' + mail + ' ' + course + ' ' + start + ' ' + end + ' ' + acceptation)
        var sql = `INSERT INTO rezerwacje (SALA_ID, Mail, NazwaPrzedmiotu, DataStartu, DataKonca, Potwierdzenie)
                   VALUES (${sala_id}, '${mail}', '${course}', '${start}', '${end}', '${acceptation}')`;
        connection.query(sql, function (err, result) {
            if (err) {
                console.log("Can't insert reservation");
            } else {
                // console.log("Inserted one row");
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
    },
    findByIdAndStartTime: function (sala_id, data_startu, callback) {
        const sql = `SELECT * FROM rezerwacje WHERE SALA_ID = ${sala_id} AND DataStartu = '${data_startu}' AND Potwierdzenie = 'pending'`;
        connection.query(sql, function (err, result) {
          if (err) {
            console.log(`Error while finding reservation by id and start time`);
            callback(err, null);
          } else {
            if (result.length > 0) {
              callback(null, result[0]);
            } else {
              callback(null, null);
            }
          }
        });
      },
    //   deleteUsosReservation: function () {
    //     var sql = `DELETE FROM rezerwacje WHERE Potwierdzenie = 'USOS'`;
    //     connection.query(sql, function (err, result) {
    //         if (err) {
    //             console.log("Can't delete reservation");
    //         } else {
    //             console.log("Deleted reservation");
    //         }
    //     })
    // },
    deleteUsosReservation: function () {
        var today = new Date().toISOString().split('T')[0];

        var sql = `DELETE FROM rezerwacje WHERE Potwierdzenie = 'USOS' AND DataStartu > '${today}'`;
        connection.query(sql, function (err, result) {
            if (err) {
                console.log("Can't delete reservation");
            } else {
                console.log("Deleted reservation");
            }
        });
    },
    deleteReservationAdmin(id) {
        var sql = `DELETE FROM rezerwacje WHERE RezerwacjaID = '${id}'`;
        return new Promise((resolve, reject) => {
            connection.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    acceptReservationAdmin(acceptationState, rezerwacjaId) {
        const sql_query = `UPDATE rezerwacje SET Potwierdzenie = '${acceptationState}' WHERE RezerwacjaID = ${rezerwacjaId}`;
        return new Promise((resolve, reject) => {
            connection.query(sql_query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    

};

module.exports = DataBase;
