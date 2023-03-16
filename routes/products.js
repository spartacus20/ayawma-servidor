require("dotenv").config();
const express = require("express");
const router = express.Router();
const { getRamdomProducts } = require("../mysql_conector");


router.get("/api/products/get/:number", async (req, res) => {

    let number = req.params.number;
    console.log(number)
    getRamdomProducts(number, res)



})





module.exports = router