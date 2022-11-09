
const express = require('express')
require('dotenv').config();
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const { getUser, getDecodedToken, conector } = require("../mysql_conector.js");

const router = express.Router();

router.get("/api/user", (req, res) => {
    getUser(req, res);
});

router.get('/api/user/id', (req, res) => {
    const decodedToken = getDecodedToken(req);
    res.send(decodedToken);
})





module.exports = router;