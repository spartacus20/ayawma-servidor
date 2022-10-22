
const express = require('express')
const { getUser } = require("../mysql_conector.js");

const router = express.Router();

router.get("/api/user",  (req, res) => {
    getUser(req, res);
   });

module.exports = router;