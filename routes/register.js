import "dotenv/config";
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import { RegisterUser } from "../mysql_conector.js";

const router = express.Router();

/* A post request that is handling the registration of the user. */
router.post("/users/register", async (req, res) => {
    try{

      //getting variables from body of the request.
      const { body } = req;
      const name = body.username;
      const email = body.email;
      const password = body.password;
      
      //Create de Access Token and send it to the user
      const userForToken = {
        username: name,
        email: email,
      };
      
      const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET);
      const refreshToken = jwt.sign(userForToken,process.env.REFRESH_TOKEN_SECRET);
        
        let passwordHash = undefined;
        //check if is a google registration.
        if (password == undefined) {
          RegisterUser(name, email, "NULL",  res, accessToken, refreshToken);
        }else {
          passwordHash = await bcrypt.hash(password, 10);
          
          RegisterUser(name, email, passwordHash,  res, accessToken, refreshToken)
        }
      }catch(e){console.log(e);}
        
      });
      
      
export default router;


