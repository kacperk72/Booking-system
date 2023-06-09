require('dotenv').config();
const OAuth = require('oauth').OAuth;
const querystring = require('querystring');
const express = require('express');
const roomIDs = require('./roomIDs.js');
const app = express();
const cors = require('cors');

const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const REQUEST_TOKEN_URL = 'https://apps.usos.uj.edu.pl/services/oauth/request_token';
const ACCESS_TOKEN_URL = 'https://apps.usos.uj.edu.pl/services/oauth/access_token';
const AUTHORIZE_URL = 'https://apps.usos.uj.edu.pl/services/oauth/authorize';

app.use(cors({
    secondary: 'http://localhost:8001'
}));

const oauth = new OAuth(
    REQUEST_TOKEN_URL,
    ACCESS_TOKEN_URL,
    CONSUMER_KEY,
    CONSUMER_SECRET,
    '1.0',
    null,
    'HMAC-SHA1'
);

let usosTokenLink = '';
let usosOauthToken = '';
let usosOauthTokenSecret = '';
let usosOauthAccessToken = ''
let usosOauthAccessTokenSecret = ''

let numbers = [];
let allJsons = [];


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
                resolve(true);
            }
        });
    });
}

function getWithOAuth(url, accessToken, accessTokenSecret) {
    return new Promise((resolve, reject) => {
        oauth.get(url, accessToken, accessTokenSecret, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

async function getReservations() {
    allJsons = []
    const url = 'https://apps.usos.uj.edu.pl/services/tt/room';

    const currentYear = new Date().getFullYear();
    const startDate = new Date(`${currentYear}-01-01`);
    const endDate = new Date(`${currentYear}-12-31`);

    while (startDate <= endDate) {
        numbers = await roomIDs.getRoomIDs();
        for (const number of numbers) {
            const roomId = number.toString();
            const oa = new OAuth(null, null, CONSUMER_KEY, CONSUMER_SECRET, '1.0', null, 'HMAC-SHA1');
            const formattedDate = startDate.toISOString().slice(0, 10);
            const queryParams = {
                room_id: roomId,
                start: formattedDate,
            };
            const urlWithParams = `${url}?${querystring.stringify(queryParams)}`
            try {
                const data = await getWithOAuth(urlWithParams, usosOauthAccessToken, usosOauthAccessTokenSecret);
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
            } catch (err) {
                console.error(err);
            }
        }
        startDate.setDate(startDate.getDate() + 7);
    }
}



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
    checkAuthorization(code)
        .then((authorized) => {
            res.send(authorized);
        })
        .catch((error) => {
            console.error('Error in checkAuthorization:', error);
            res.status(500).send('Internal server error');
        });
});

app.get('/data', (req, res) => {
    let Jsonss = JSON.stringify(allJsons)
    res.json(Jsonss);
});


app.listen(8001, () => {
});

module.exports.getReservations = getReservations;
