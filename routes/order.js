require("dotenv").config();
const express = require("express");
const router = express.Router();
const  {  getDecodedToken, setOrder} = require("../mysql_conector.js");
 

router.post("/set-order", (req, res) => {


    const { token, basket, order_id} = req.body; 
    
    const userID = getDecodedToken(token);

    console.log(basket)

    setOrder(res,order_id, userID, basket)


})

module.exports = router