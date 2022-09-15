import express, { request } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import dotenv  from "dotenv";
import { RegisterUser, conector, conn } from "./mysql_conector.js";
dotenv.config(); 
const app = express();
const port =  process.env.PORT || 3001;
//Cors policy settings. 
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.json());

//Save the name as a cookie 
app.post("/users/register", async (req, res) => {
  try {

    //getting variables from body of the request.
    const { body } = req
    const name = body.username;
    const email = body.email;
    const password = body.password;
    const googleToken = body.googleToken;
     
    //Create de Access Token and send it to the user
    const userForToken = {
       username: name, 
       email: email
    }

    const token = jwt.sign(userForToken, "12333")
   
    //check if is a google registration.
    if (password == undefined) {
      RegisterUser(name, email, "NULL", googleToken, res);
    }


    let passwordHash = await bcrypt.hash(password, 10); 
    
    RegisterUser(name, email, passwordHash, "NULL", res);
    
    res.send({
      username: name,
      email: email,
      password: passwordHash,
      token
    })
   
  } catch (e) {
    console.log(e);
  }
});

//El servidor tiene que enviarle el access token al usuario. 
//El  servidor web crea una refresh token y la manda al servidor.
//El servidor le responde con la access token.  

app.post("/users/login", async (req, res) => {
  

  
});

app.listen(port, () => {
  conn(); 
  console.log("Server is running on port 3001! Everything is working");
});
