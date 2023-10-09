require('dotenv').config()
var express = require('express')
var cors = require('cors')

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

var bodyParser = require('body-parser')

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

var app = express()

app.use(cors());
app.use(bodyParser.json());

app.get('/getAccessToken', async function (req, res) {
    req.query.code;

    const params = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + req.query.code;

    await fetch("https://github.com/login/oauth/access_token" + params, {
        method: "POST",
        headers: {
            "Accept": "application/json"
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        //console.log(data)
        res.json(data)
    })
})

//getUserData
//access token is passed as an authorization header


app.get('/getUserData', async function (req, res) {
    console.log(req.get("Authorization"))
    await fetch("https://api.github.com/user", {
        method: "GET", 
        headers: {
            "Authorization": req.get("Authorization")
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data)
        res.json(data)
    }).catch((error) => {
        console.log(error)
    })
})

app.listen(4000, function () {
    console.log("CORS server srunning on port 4000")
})