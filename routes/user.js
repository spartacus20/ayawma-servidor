
const express = require('express')
const { getUser, getDecodedToken } = require("../mysql_conector.js");

const router = express.Router();

router.get("/api/user",  (req, res) => {
    getUser(req, res);
   });

router.get('/api/user/id', (req, res) => {
    const decodedToken = getDecodedToken(req);
    res.send(decodedToken);
})

module.exports = router;