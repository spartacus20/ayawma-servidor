require("dotenv").config();

const fileUpload = require('express-fileupload');
const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const cors = require("cors");
const handleError = require("./middleware/handleErrors.js")
const {  getProduct, getProductInformation, addProduct, getAllProducts } = require("./mysql_conector.js")
const databaseMiddleware = require("./middleware/DBhandler.js")

//ROUTES 

const rating = require("./routes/rating.js")
const register = require("./routes/register.js")
const login = require("./routes/login.js");
const user = require("./routes/user.js")
const stripe = require("./routes/stripe2.js");
const order = require("./routes/order.js");
const resetpassword = require("./routes/resetpassword.js")

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
app.use(bodyParser.json());
app.use(fileUpload());


app.use("/", user);
app.use("/", register)
app.use("/", login);
app.use("/", rating);
app.use("/", resetpassword)
app.use("/", stripe);
app.use("/", order);
// app.use("/", product);


app.post("/product/add", (req, res) => {

  /* Checking if the file is null, if it is null it is returning a message saying that there is no file
  uploaded. If it is not null it is getting the name, price and description from the body. Then it is
  getting the file from the files.file. Then it is moving the file to the images folder. If there is
  an error it is returning a message saying that there is an error. If there is no error it is
  returning the file name and the file path. */

  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const { name, price, description } = req.body
  const file = req.files.file;

  console.log(file.data)
  // console.log(file.data)
  // console.log(__dirname)
  // addProduct(name, price, description, file.name);
  // file.mv(`${__dirname}/images/${file.name}`, err => {
  //   if(err) {
  //     console.error(err);
  //     return res.status(500).send(err);
  //   }
  //   res.json({ fileName: file.name, filePath: `/images/${file.name}` });
  // })

 
})






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


app.get('/prueba', (req, res) => {
  res.send({ msg: "Everything is great!" });
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

app.use((req, res, next) => {databaseMiddleware});



app.listen(port, () => {
  /* Serving the static files in the public folder. */
  express.static(path.join(__dirname, "./public"))
  console.log("Server is running on port " + port + "\n Everything is working");
});
