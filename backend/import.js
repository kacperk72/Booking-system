require('dotenv').config();
const OAuth = require('oauth').OAuth;
const readline = require('readline');
const https = require('https');
const querystring = require('querystring');
const express = require('express');
const fs = require('fs');
const roomIDs = require('./roomIDs.js');
const app = express();
const cors = require('cors');

const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const REQUEST_TOKEN_URL = 'https://apps.usos.uj.edu.pl/services/oauth/request_token';
const ACCESS_TOKEN_URL = 'https://apps.usos.uj.edu.pl/services/oauth/access_token';
const AUTHORIZE_URL = 'https://apps.usos.uj.edu.pl/services/oauth/authorize';
let numbers = [];

// let numbers = [3172, 3170, 3171, 3164, 3165, 3161, 3162, 3163, 3167, 3168, 3169, 3166, 3173, 3183, 3190, 3182, 3189,
//     3181, 3188, 3179, 3174, 3178, 3177, 3175, 3176, 3180, 3185, 3186, 3191, 3354];
let allJsons = [];

const oauth = new OAuth(
    REQUEST_TOKEN_URL,
    ACCESS_TOKEN_URL,
    CONSUMER_KEY,
    CONSUMER_SECRET,
    '1.0',
    null,
    'HMAC-SHA1'
);

app.use(cors({
    secondary: 'http://localhost:8001'
}));


let usosTokenLink = '';
let usosOauthToken = '';
let usosOauthTokenSecret = '';
let usosOauthAccessToken = ''
let usosOauthAccessTokenSecret = ''

function getUsosTokenLink() {
    return new Promise((resolve, reject) => {
        oauth.getOAuthRequestToken({oauth_callback: 'oob'}, function (err, oauthToken, oauthTokenSecret, results) {
            if (err) {
                console.log('Error getting OAuth request token:', err);
                resolve("http://localhost:4200/logowanie");
            } else {
                usosOauthToken = oauthToken;
                usosOauthTokenSecret = oauthTokenSecret;
                usosTokenLink = AUTHORIZE_URL + '?oauth_token=' + oauthToken
                resolve(usosTokenLink);
            }
        });
    });
}

function checkAuthorization(code) {
    return new Promise((resolve, reject) => {
        oauth.getOAuthAccessToken(usosOauthToken, usosOauthTokenSecret, code, function (err, oauthAccessToken, oauthAccessTokenSecret, results) {
            usosOauthAccessToken = oauthAccessToken;
            usosOauthAccessTokenSecret = oauthAccessTokenSecret;
            if (err) {
                console.log('Error getting OAuth access token:', err);
                resolve(false);
            } else {
                getReservations()
                resolve(true);
            }
        });
    });
}


async function getReservations() {
    const url = 'https://apps.usos.uj.edu.pl/services/tt/room';
    const date = new Date();
    while (date <= new Date('2023-06-13')) {
        numbers = await roomIDs.getRoomIDs();
        numbers.forEach((number) => {
            const roomId = number.toString();
            const oa = new OAuth(null, null, CONSUMER_KEY, CONSUMER_SECRET, '1.0', null, 'HMAC-SHA1');
            const formattedDate = date.toISOString().slice(0, 10);
            const queryParams = {
                room_id: roomId,
                start: formattedDate,
            };
            // const urlWithParams = `${url}?${querystring.stringify({room_id: roomId})}`;
            const urlWithParams = `${url}?${querystring.stringify(queryParams)}`
            oa.get(urlWithParams, usosOauthAccessToken, usosOauthAccessTokenSecret, function (err, data, response) {
                if (err) {
                    console.error(err);
                } else {
                    let dataObject = JSON.parse(data);
                    let newData = dataObject.map(function (item) {
                        return {
                            id: number,
                            start_time: item.start_time,
                            end_time: item.end_time,
                            name_pl: item.name.pl
                        };
                    });
                    allJsons.push(newData)
                }
            });

        });
        date.setDate(date.getDate() + 7);
    }
}

/*
(async () => {
    numbers = await roomIDs.getRoomIDs();
    // numbers.forEach(item => {
    //     console.log(item);
    // });
    oauth.getOAuthRequestToken({oauth_callback: 'oob'}, function (err, oauthToken, oauthTokenSecret, results) {
        if (err) {
            console.log('Error getting OAuth request token:', err);
        } else {
            let usosOauthToken = oauthToken;
            let usosOauthTokenSecret = oauthTokenSecret;
            usosTokenLink = AUTHORIZE_URL + '?oauth_token=' + oauthToken
            console.log('Authorize the app by visiting:', usosTokenLink);

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('Enter the PIN code and hit ENTER when you\'re done: ', function (pin) {
                
                rl.close();
                oauth.getOAuthAccessToken(oauthToken, oauthTokenSecret, pin, function (err, oauthAccessToken, oauthAccessTokenSecret, results) {
                    if (err) {
                        console.log('Error getting OAuth access token:', err);
                    } else {

                        const url = 'https://apps.usos.uj.edu.pl/services/tt/room';
                        const date = new Date();
                        while (date <= new Date('2023-06-13')) {

                            numbers.forEach((number) => {
                                const roomId = number.toString();
                                const oa = new OAuth(null, null, CONSUMER_KEY, CONSUMER_SECRET, '1.0', null, 'HMAC-SHA1');


                                const formattedDate = date.toISOString().slice(0, 10);

                                const queryParams = {
                                    room_id: roomId,
                                    start: formattedDate,
                                };

                                // const urlWithParams = `${url}?${querystring.stringify({room_id: roomId})}`;
                                const urlWithParams = `${url}?${querystring.stringify(queryParams)}`
                                oa.get(urlWithParams, oauthAccessToken, oauthAccessTokenSecret, function (err, data, response) {
                                    if (err) {
                                        console.error(err);
                                    } else {
                                        // console.log(response.statusCode);
                                        let dataObject = JSON.parse(data);


                                        let newData = dataObject.map(function (item) {
                                            return {
                                                id: number,
                                                start_time: item.start_time,
                                                end_time: item.end_time,
                                                name_pl: item.name.pl
                                            };
                                        });

                                        allJsons.push(newData)


                                    }
                                });

                            });

                            date.setDate(date.getDate() + 7);

                        }
                    }
                });
            });

        }
        return allJsons;
    });
})(); */

app.get('/data', (req, res) => {
    
    allJsons = JSON.stringify(allJsons)
    // const combinedJson = allJsons.reduce((acc, curr) => {
    //     const json = JSON.parse(fs.readFileSync(curr));
    //     return { ...acc, ...json };
    // }, {});
    // console.log(allJsons);
    res.json(allJsons);
});

app.get('/usos-token', (req, res) => {
    getUsosTokenLink()
        .then((usosTokenLink) => {
            res.send(usosTokenLink);
        })
        .catch((error) => {
            console.error('Error in app.get(/usos-token):', error);
            res.status(500).send('Internal server error');
        });
});

app.get('/check-usos-token', (req, res) => {
    let code = req.query.code;
    console.log("ENDPOINT " + code);
    checkAuthorization(code)
        .then((authorized) => {
            res.send(authorized);
        })
        .catch((error) => {
            console.error('Error in checkAuthorization:', error);
            res.status(500).send('Internal server error');
        });
});



app.listen(8001, () => {
});


