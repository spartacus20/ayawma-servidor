import "dotenv/config";
import express, { request, response } from "express";
import { handleError } from "./middleware/handleErrors.js";
import cors from "cors";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

import { RegisterUser, conector, conn, getUser } from "./mysql_conector.js";
const app = express();
const port = process.env.PORT || 3001;
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
    try{

      //getting variables from body of the request.
      const { body } = req;
      const name = body.username;
      const email = body.email;
      const password = body.password;
      const googleToken = body.googleToken;
      
      //Create de Access Token and send it to the user
      const userForToken = {
        username: name,
        email: email,
      };
      
      const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET);
      const refreshToken = jwt.sign(
        userForToken,
        process.env.REFRESH_TOKEN_SECRET
        );
        
        let passwordHash = undefined;
        //check if is a google registration.
        if (password == undefined) {
          RegisterUser(name, email, "NULL", googleToken, res, accessToken, refreshToken);
        }else {
          passwordHash = await bcrypt.hash(password, 10);
          RegisterUser(name, email, passwordHash, "NULL", res, accessToken, refreshToken)
        }

        // res.status(200).send({
        //   message: "Success",
        //   username: name,
        //   email: email,
        //   accessToken: accessToken,
        //   refreshToken: refreshToken,
        // });
      }catch(e){console.log(e);}
        
      });
      
      //El servidor tiene que enviarle el access token al usuario.
//El  servidor web crea una refresh token y la manda al servidor.
//El servidor le responde con la access token.


app.get("/api/user",  (req, res) => {
  getUser(req, res);
});



app.use((err, req, res, next) => {
  handleError(err, req, res, next);
});

app.listen(port, () => {
  conn();
  console.log("Server is running on port " + port + "\n Everything is working");
});
