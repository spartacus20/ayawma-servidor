require("dotenv").config();
const express = require("express");
const router = express.Router();
const { getRamdomProducts } = require("../mysql_conector");


router.get("/api/products/get/:number", async (req, res) => {

    let number = req.params.number;
    console.log(number)
    getRamdomProducts(number, res)

})

router.get("/api/products/most_popular", async (req, res) => {
    
})






module.exports = router