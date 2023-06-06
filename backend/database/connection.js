var mysql = require("mysql2");
var connection = mysql.createConnection({
    host     : 'mysql',
    user     : 'root',
    password: 'pass',
    port: 3306,
    database : 'booking_system',
});
connection.connect();
module.exports = connection;
