require("dotenv").config();
const express = require("express");
const  { conector, getDecodedToken } = require("../mysql_conector.js");
const router = express.Router();

router.post("/set-order", (req, res) => {

    //Token, basket, dateTime
    
    const { token, basket} = req.body; 
    
    const userID = getDecodedToken(token);

    // console.log(token)
    console.log(basket)
    // console.log(dateTime)

    const QUERY = "insert into order (useID, productID, quantity, total, datime) values (?, ?, ?, ?, ?)" 


    res.send({msg: "Everything ok!"})

})

module.exports = router