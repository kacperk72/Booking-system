const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// import DataBase from './database/db.js';
var DataBase = require('./database/db.js');

var app = express();

app.listen(3000);

app.use(cors({
    origin: 'http://localhost:4200',
}));
app.use(express.json());

app.route('/room-list').get(function(req, res) {
    DataBase.getRooms(function(err, result) {
        res.send(result);
    });
});
