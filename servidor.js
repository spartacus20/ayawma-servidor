require("dotenv").config(); 

const bodyParser = require("body-parser"); 
const path = require("path"); 
const express = require("express"); 
const cors = require("cors"); 
const  handleError  = require("./middleware/handleErrors.js")
const { conn, getProduct, getProductInformation } = require("./mysql_conector.js")


//ROUTES 

const rating = require("./routes/rating.js")
const register = require("./routes/register.js")
const login = require("./routes/login.js"); 
const user = require("./routes/user.js")
const stripe = require("./routes/stripe.js"); 
const resetpassword = require("./routes/resetpassword.js")


/* Getting the path of the file. */


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

app.use("/", user);
app.use("/", register)
app.use("/", login);
app.use("/", rating);
app.use("/", resetpassword)
/* A post request that is handling the registration of the user. */


/* A post request that is handling the login of the user. */



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

app.get('/prueba', (req, res) => {
  res.send({msg: "Everything is great!"});
})


// /* A post request that is handling the payment. */
app.post('/create-checkout-session', stripe)


/* Getting the user information from the database. */




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
  conn
  /* Serving the static files in the public folder. */
  express.static(path.join(__dirname, "./public"))
  console.log("Server is running on port " + port + "\n Everything is working");
});
