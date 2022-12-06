const mysql = require("mysql");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const conector = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

function conn() {
  conector.connect((err) => {
    if (err) throw err;
    console.log("Database has been connected");
  });
};

const RegisterUser = (userName, email, password, res) => {
  //CHECK IF  USER HAS ALEREADY REGISTERED.


  var CHECKUSER = "SELECT * FROM users WHERE email = '" + email + "'";
  conector.query(CHECKUSER, (err, rows) => {
    if (err) throw err;

    if (password) {
      if (rows.length > 0) {
        return res.status(400).send({ msg: "USER ALEREADY REGISTERED" });
      }
    }

    console.log("Valor de password: " + password);
    var QUERY = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    conector.query(QUERY, [userName, email, password], (error, row) => {
      //Create de Access Token and send it to the user
      const userForToken = {
        id: row.insertId
      };

      console.log(row.insertId);

      const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET);
      const refreshToken = jwt.sign(userForToken, process.env.REFRESH_TOKEN_SECRET);

      if (error) throw error;
      res.status(200).send({
        message: "Success",
        username: userName,
        email: email,
        accessToken: accessToken,
        refreshToken: refreshToken,

      });
    });
  });
};

function LoginUser(email, password, res, name) {
  var CHECK = "SELECT * FROM users WHERE email = '" + email + "'";
  conector.query(CHECK, async (err, rows) => {
    if (err) throw err;
    let accessToken = {}
    let refreshToken = {}
    const data = JSON.parse(JSON.stringify(rows));
    //console.log(rows.length)
    //WHEN THE USER USE GOOGLE AUTENTIFICATION
    if (password == undefined) {
      //WHEN THE USER USE GOOGLE AUTENTIFICATION AND HAVE AN ACCOUNT.       
      if (rows.length > 0) {

        const Tokeninfo = {
          id: data[0].id,
        }
        accessToken = jwt.sign(Tokeninfo, process.env.ACCESS_TOKEN_SECRET);
        refreshToken = jwt.sign(Tokeninfo, process.env.REFRESH_TOKEN_SECRET);
        res.status(200).send({ msg: "Success", accessToken: accessToken, refreshToken: refreshToken });


      } else {

        const UserRegisterToken = {
          id: data[0].id,
        }
        // WHEN THE USER DONT HAVE ACCOUNT AND  USE GOOGLE AUTENTIFICATION
        accessToken = jwt.sign(UserRegisterToken, process.env.ACCESS_TOKEN_SECRET);
        refreshToken = jwt.sign(UserRegisterToken, process.env.REFRESH_TOKEN_SECRET)
        RegisterUser(name, email, "NULL", res, accessToken, refreshToken)
      }

    } else {

      //EVERYTHIN IS OK. 
      if (rows.length > 0) {
        const Tokeninfo = {
          id: data[0].id,
        }
        accessToken = jwt.sign(Tokeninfo, process.env.ACCESS_TOKEN_SECRET);
        refreshToken = jwt.sign(Tokeninfo, process.env.REFRESH_TOKEN_SECRET);
        let passwordHash = data[0].password
        let pass = bcrypt.compare(password, passwordHash).then(response => {
          res.status(201).send({ msg: "Success", accessToken: accessToken, refreshToken: refreshToken });
        }).catch(err => { res.status(401).send({ msg: "Email or password invalid" }) })

      } else {
        res.status(401).send({ msg: "Email or password invalid" })
      }
    }
  });




}


function getDecodedToken(req) {
  const authorization = req.get('Authorization') || req.body.headers.Authorization;
  let token = "";
  if (authorization && authorization.toLocaleLowerCase().startsWith("bearer")) {
    token = authorization.substring(7);
  }
  let decodeToken = {};

  decodeToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  return decodeToken;
};


function getProductInformation(product, res) {
  const QUERY = "SELECT * from products WHERE title='" + product + "'"

  conector.query(QUERY, (err, rows) => {
    if (err) throw err;
    const data = JSON.parse(JSON.stringify(rows));

    if (rows.length < 1) {
      res.status(404).send({ msg: "No product found" })
    } else {
      res.status(201).send({ data })
    }

  })
}



function getDiscount(res, code) {

  const QUERY = "SELECT * FROM discount WHERE code='" + code + "'"

  conector.query(QUERY, (err, rows) => {
    if (err) res.status(err).status(400).send({ msg: "Something went wrong" });

    if (rows.length > 0) {
      const data = JSON.parse(JSON.stringify(rows));
      res.status(201).send({ data })
    } else {
      res.status(400).send({ msg: "Discount code is not valid" });
    }

  })


}



function getProduct(product, res) {
  const QUERY = "SELECT * FROM products WHERE title LIKE '%" + product + "%' OR description LIKE '%" + product + "%'"

  conector.query(QUERY, (err, rows) => {
    if (err) throw err;

    console.log("Rows of the product: " + rows.length)

    if (rows.length > 0) {
      const data = JSON.parse(JSON.stringify(rows));
      res.status(201).send({ data })
    } else {
      res.status(404).send({ msg: "Product not found" });
    }


  })
}

//TODO: Validate refreshToken and send user information to the client.
function getUser(request, response) {

  const decodedToken = getDecodedToken(request);
  const QUERY = "SELECT name,email FROM users WHERE id = ?"

  console.log(decodedToken)

  conector.query(QUERY, [decodedToken.id], (err, rows) => {
    if (err) throw err;
    const data = JSON.parse(JSON.stringify(rows));
    console.log("yola")
    console.log(data)
    response.status(201).send({ data })
  })




};

function addProduct(title, price, description, image) {
  const QUERY = "INSERT INTO products (title, price, description, images) VALUES ('" + title + "','" + price + "','" + description + "','" + image + "')"
  conector.query(QUERY, (err) => {
    if (err) throw err;
    console.log("Product added")
  })


}


//const QUERY = "SELECT * FROM users where email="


module.exports = { LoginUser, getUser, RegisterUser, conn, getDecodedToken, getProduct, getProductInformation, conector, addProduct};

