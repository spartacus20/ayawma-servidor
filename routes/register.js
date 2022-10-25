const mysql = require("mysql");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { RegisterUser } = require("../mysql_conector.js");
const express = require("express");
const router = express.Router();

/* A post request that is handling the registration of the user. */
router.post("/users/register", async (req, res) => {
    try{

      //getting variables from body of the request.
      const { body } = req;
      const name = body.username;
      const email = body.email;
      const password = body.password;
      
    
        
        let passwordHash = undefined;
        //check if is a google registration.
        if (password == undefined) {
          RegisterUser(name, email, "NULL",  res);
        }else {
          passwordHash = await bcrypt.hash(password, 10);
          
          RegisterUser(name, email, passwordHash,  res)
        }
      }catch(e){console.log(e);}
        
      });
      
      


module.exports = router;