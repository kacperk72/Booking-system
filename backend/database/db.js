var connection = require('./connection.js');

var DataBase = {
    getRooms: function(callback) {
        connection.query('SELECT * FROM sale', function(err, result) {
            if (err) {
                console.log("Error while listing rooms");
            }
            else {
                callback(err, result);
            }
        });
    },
    insertRoom: function(id, seats, name) {
        var sql = "INSERT INTO sale VALUES (" + id + ", " + seats + ", '" + name + "')";
        connection.query(sql, function(err, result) {
            if (err) {
                console.log("Can't insert");
            }
            else {
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
        connection.query(sql, function(err, result) {
            if (err) {
                console.log("Can't filter data");
            }
            else {
                console.log("Data filtered");
                callback(err, result);
            }
        });
    }

};

module.exports = DataBase;
