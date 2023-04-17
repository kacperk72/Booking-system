var mysql = require("mysql");
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'booking_system',
});
connection.connect();
module.exports = connection;
