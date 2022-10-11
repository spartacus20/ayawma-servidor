import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { handleError } from "./middleware/handleErrors.js";
import { conn, getProduct, getProductInformation} from "./mysql_conector.js";

//ROUTES 
import register from "./routes/register.js"; 
import login from "./routes/login.js"
import user from "./routes/user.js";
import stripe from "./routes/stripe.js";


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

/* A post request that is handling the registration of the user. */
app.post("/users/register", register); 


/* A post request that is handling the login of the user. */
app.post("/users/login", login); 


/* A get request that is getting the information of the product. */

app.get("/api/product/:product/info", async (req, res) => {

  let product = req.params.product;
  getProductInformation(product, res)

})


/* This is a get request that is getting the product from the database. */
app.get("/api/product/:producto", async (req, res) => {

  let product = req.params.producto;
  getProduct(product, res)

})

/* A post request that is handling the payment. */
app.post('/create-checkout-session', stripe)


/* Getting the user information from the database. */
app.get("/api/user", user);



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
  /* Connecting to the database. */
  conn();
  /* Serving the static files in the public folder. */
  express.static(path.join(__dirname, "./public"))
  console.log("Server is running on port " + port + "\n Everything is working");
});
