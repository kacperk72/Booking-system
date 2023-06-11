const http = require('http');
const fetch = require('node-fetch');
var DataBase = require('./database/db.js');
const roomIDs = require('./roomIDs.js');
const bodyParser = require('body-parser');

const hostname = 'localhost';
const port = 8002;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('import sal');
});

let numbers = [];

async function importingRooms() {
    try {
        numbers = await roomIDs.getRoomIDs();

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
    } catch (err) {
        console.error(err);
    }
}

server.listen(port, hostname, async () => {
    await importingRooms();
});
