require("dotenv").config();
const express = require("express");
const  { LoginUser } = require("../mysql_conector.js");

const router = express.Router();

router.post("/users/login", async (req, res) => 
{
  
  const { body } = req;
  const name = body.username;
  const email = body.email;
  const password = body.password;

  LoginUser(email, password, res, name); 

})

module.exports = router;