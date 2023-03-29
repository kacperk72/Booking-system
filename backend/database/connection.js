var mysql = require("mysql");
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'booking_system',
    password : '12345',
    database : 'booking_system'
});
connection.connect();
module.exports = connection;
