import "dotenv/config";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

import { handleError } from "./middleware/handleErrors.js";
import { RegisterUser, LoginUser, conn, getUser, getProduct, getProductInformation, getDiscount } from "./mysql_conector.js";


/* Getting the path of the file. */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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



app.post("/users/login", async (req, res) => 
{
  
  const { body } = req;
  const name = body.username;
  const email = body.email;
  const password = body.password;
  console.log(password)

  LoginUser(email, password, res, name); 

})

app.get("/api/product/:product/info", async (req, res) => {

  let product = req.params.product;
  getProductInformation(product, res)

})


app.get("/api/product/:producto", async (req, res) => {

  

  let product = req.params.producto;

  getProduct(product, res)

})

app.get("/api/user",  (req, res) => {
 getUser(req, res);
});

app.post("/api/discount", (req, res) => {
  
  const { body } = req;
  const discount = body.discount;

  getDiscount(res, discount); 

})

/* Sending the image to the client. */
app.get("/images/:img",  (req, res) => {
   let img = req.params.img;
   res.sendFile(path.join(__dirname+`/images/${img}`))
  });
 
/* A middleware that is handling the errors. */
app.use((err, req, res, next) => {
  handleError(err, req, res, next);
});

app.listen(port, () => {
  conn();
 /* Serving the static files in the public folder. */
  express.static(path.join(__dirname, "./public"))
  console.log("Server is running on port " + port + "\n Everything is working");
});
