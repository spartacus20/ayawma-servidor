require("dotenv").config();

const fileUpload = require('express-fileupload');
const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const cors = require("cors");
const handleError = require("./middleware/handleErrors.js")
const { getProduct, getProductInformation, addProduct, getAllProducts, getProductByID, getAllUsers } = require("./mysql_conector.js")
const databaseMiddleware = require("./middleware/DBhandler.js")
const cloudinary = require("./Config/cloudinary.js");
const { Buffer } = require('buffer');

//ROUTES 

const rating = require("./routes/rating.js")
const register = require("./routes/register.js")
const login = require("./routes/login.js");
const user = require("./routes/user.js")
const stripe = require("./routes/stripe2.js");
const order = require("./routes/order.js");
const resetpassword = require("./routes/resetpassword.js")
const admin = require("./routes/admin.js")
serve

// const product = require("./routes/product.js"); 


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
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.text({ limit: '200mb' }));
app.use(fileUpload());


app.use("/", user);
app.use("/", register)
app.use("/", login);
app.use("/", rating);
app.use("/", resetpassword)
app.use("/", stripe);
app.use("/", order);
app.use("/", admin);
app.use("/", products);
// app.use("/", product);







app.get("/api/product/:product/info", async (req, res) => {

  let product = req.params.product;
  getProductInformation(product, res)

})



/* This is a get request that is getting the product from the database. */
app.get("/api/product/:producto", async (req, res) => {

  let product = req.params.producto;
  getProduct(product, res)

})

app.get("/api/products", async (req, res) => {
  getAllProducts(res);
})

app.get("/api/product/:id/edit", async (req, res) => {
  let id = req.params.id;
  getProductByID(id, res)
})

app.get("api/product/:id/information", async (req, res) => {
  let id = req.params.id;
  getProductByID(id, res);
})

app.get('/prueba', (req, res) => {
  getAllUsers(res)
})




// /* A post request that is handling the payment. */
app.post('/create-checkout-session', stripe)



/* Sending the image to the client. */
app.get("/images/:img", (req, res) => {
  let img = req.params.img;
  res.sendFile(path.join(__dirname + `/images/${img}`))
});

/* A middleware that is handling the errors. */
app.use((err, req, res, next) => {
  handleError(err, req, res, next);
});

app.use((req, res, next) => { databaseMiddleware });



app.listen(port, () => {
  /* Serving the static files in the public folder. */
  express.static(path.join(__dirname, "./public"))
  console.log("Server is running on port " + port + "\n Everything is working");
});
