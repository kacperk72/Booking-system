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
    }
};

module.exports = DataBase;
