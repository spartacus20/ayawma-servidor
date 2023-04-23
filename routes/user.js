
const express = require('express')
require('dotenv').config();
const bcrypt = require("bcrypt");
const { getUser, getDecodedToken, UpdatePassword, getOrdersbyUserID, UpdateEmail } = require("../mysql_conector.js");

const router = express.Router();

router.get("/api/user", (req, res) => {
    getUser(req, res);
});

router.get('/api/user/id', (req, res) => {
    const decodedToken = getDecodedToken(req);
    res.send(decodedToken);
})


router.post('/api/user/change/general-settings', async (req, res) => {
    const { email, name } = req.body;
    UpdateEmail(res,req, name, email)
})



router.post('/api/user/change/password', async (req, res) => {
    const { password } = req.body;
    let passwordHashed = await bcrypt.hash(password, 10);
    UpdatePassword(res, req, passwordHashed)
})









module.exports = router;