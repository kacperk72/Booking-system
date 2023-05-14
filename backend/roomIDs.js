const fetch = require('node-fetch');

let nums = [];

// var functions = {
//     getRoomIDs: async function () {
//         fetch('https://apps.usos.uj.edu.pl/services/geo/building2?building_id=Loj11&fields=rooms')
//         .then(response => response.json())
//         .then(data => {
//             const parsedData = JSON.parse(JSON.stringify(data));
//             parsedData.rooms.forEach(item => {
//                 nums.push(Number(item.id));
//             });
//             return nums;
//         })
//         .catch(err => {
//             console.error(err);
//         });
//     }
// };

var functions = {
    getRoomIDs: async function () {
        try {
            const response = await fetch('https://apps.usos.uj.edu.pl/services/geo/building2?building_id=Loj11&fields=rooms');
            const data = await response.json();
            const parsedData = JSON.parse(JSON.stringify(data));
            const nums = [];
            parsedData.rooms.forEach(item => {
                nums.push(Number(item.id));
            });
            return nums;
        } catch (err) {
            console.error(err);
        }
    }
};

module.exports = functions;
