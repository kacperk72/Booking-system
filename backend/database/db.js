// import connection from './connection.js'
var connection = require('./connection.js');

var DataBase = {
    getRooms: function(callback) {
        connection.query('SELECT * FROM sale', function(err, result) {
            callback(err, result);
        });
    },

};

module.exports = DataBase;
// export default DataBase;
