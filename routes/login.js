require("dotenv").config();
const express = require("express");
const  { LoginUser, AdminLogin } = require("../mysql_conector.js");

const router = express.Router();

router.post("/users/login", async (req, res) => 
{
  
  const { body } = req;
  const name = body.username;
  const email = body.email;
  const password = body.password;

  LoginUser(email, password, res, name); 

})

router.post("/api/admin/login", async (req, res) =>{

  const { body } = req;
  const email = body.email;
  const password = body.password;

  AdminLogin(email, password, res);
})




module.exports = router;