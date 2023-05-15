const mysql = require("mysql");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const conector = require("./middleware/DBhandler.js");


const getRamdomProducts = (num, res) => {

  var QUERY = "SELECT * FROM products ORDER BY RAND() LIMIT " + num

  conector.query(QUERY, (err, rows) => {
    if (err) throw err;
    const data = JSON.parse(JSON.stringify(rows));
    res.status(201).send({ data })
  })

}



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
      console.log("Valor de row: " + row);
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

     

        // WHEN THE USER DONT HAVE ACCOUNT AND  USE GOOGLE AUTENTIFICATION
        var QUERY = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        conector.query(QUERY, [name, email, "NULL"], (error, row) => {
          //Create de Access Token and send it to the user
          console.log("Valor de row: " + row);
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
      }

    } else {

      console.log(data)
      //EVERYTHIN IS OK. 
      if (rows.length > 0) {
        const Tokeninfo = {
          id: data[0].id,
        }
        accessToken = jwt.sign(Tokeninfo, process.env.ACCESS_TOKEN_SECRET);
        refreshToken = jwt.sign(Tokeninfo, process.env.REFRESH_TOKEN_SECRET);
        let passwordHash = data[0].password

        const isMatch = await bcrypt.compare(password, passwordHash)

        if (!isMatch) {
          res.status(401).send({ msg: "Email or password invalid" })
        } else {
          res.status(201).send({ msg: "Success", accessToken: accessToken, refreshToken: refreshToken });
        }


      } else {
        res.status(401).send({ msg: "Email or password invalid" })
      }
    }
  });




}

function AdminLogin(email, password, res) {
  var CHECK = "SELECT * FROM users WHERE email = '" + email + "' and admin = 1";
  conector.query(CHECK, async (err, rows) => {
    if (err) throw err;
    let accessToken = {}
    let refreshToken = {}
    const data = JSON.parse(JSON.stringify(rows));

    if (rows.length > 0) {
      const Tokeninfo = {
        id: data[0].id,
      }
      accessToken = jwt.sign(Tokeninfo, process.env.ACCESS_TOKEN_SECRET);
      refreshToken = jwt.sign(Tokeninfo, process.env.REFRESH_TOKEN_SECRET);
      let passwordHash = data[0].password
      const isMatch = await bcrypt.compare(password, passwordHash)
      if (!isMatch) {
        res.status(401).send({ msg: "Email or password invalid" })
      } else {
        res.status(201).send({ msg: "Success", accessToken: accessToken, refreshToken: refreshToken });
      }
    } else {
      res.status(401).send({ msg: "Email or password invalid" })
    }
  })
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

function getAllProducts(res) {
  const QUERY = "SELECT * from products"
  conector.query(QUERY, (err, rows) => {
    if (err) throw err;
    const data = JSON.parse(JSON.stringify(rows));
    res.status(201).send({ data })
  })
}

function getAllUsers(res) {
  const QUERY = "SELECT * from users"
  conector.query(QUERY, (err, rows) => {
    if (err) throw err;
    const data = JSON.parse(JSON.stringify(rows));
    res.status(201).send({ data })
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

function getProductByID(id, res) {

  const query = "SELECT * FROM products WHERE id = " + id;
  conector.query(query, (err, rows) => {

    if (rows.length > 0) {
      const data = JSON.parse(JSON.stringify(rows));
      res.status(201).send({ data })
    } else {
      res.send({ msg: "Product not found" });
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

function setOrder(req, res, order_id, products, shipping_address,payment_method) {

  const QUERY = "INSERT INTO `orders`(`order_id`, `user_id`, `products`,`shipping_address`,  `payment_method`) VALUES (?, ?, ?, ?, ?)";

  const user_id = getDecodedToken(req);
  console.log("UserID: " + user_id.id)
  console.log("products: ")
  console.log("payment_method: " + payment_method)


  conector.query(QUERY, [order_id, user_id.id, JSON.stringify(products),  JSON.stringify(shipping_address) , payment_method], (err) => {
    if (err) console.log(err);
    res.send({ msg: "Order has been created" })
  })



}



function getOrdersbyUserID(req) {

  const QUERY = "SELECT * from orders WHERE user_id = ?";
  const user_id = getDecodedToken(req);
  conector.query(QUERY, [user_id.id], (err, rows) => {
    if (err) console.log(err);
    const data = JSON.parse(JSON.stringify(rows));
    return data;
  })


}

function UpdatePassword(req, res, passwordHashed) {
  const QUERY = "UPDATE `users` SET password = ? WHERE id = ?";
  const user_id = getDecodedToken(req)
  conector.query(QUERY, [passwordHashed, user_id], (err) => {
    if (err) throw err;
    res.send({ msg: "Password has been changed" })
  })
}

function UpdateEmail(res, req, name, email) {

  const user_id = getDecodedToken(req)

  if (name === undefined) {
    const QUERY = "UPDATE `users` SET email = ? WHERE id = ?";
    conector.query(QUERY, [email, user_id.id], (err) => {
      if (err) throw err;
      res.send({ msg: "Email has been changed" })
    })
  } else if (email === undefined) {
    const QUERY = "UPDATE `users` SET name = ? WHERE id = ?";
    conector.query(QUERY, [name, user_id.id], (err) => {
      if (err) throw err;
      res.send({ msg: "Name has been changed" })
    })
  } else {
    const QUERY = "UPDATE `users` SET name = ?, email = ? WHERE id = ?";
    conector.query(QUERY, [name, email, user_id.id], (err) => {
      if (err) throw err;
      res.send({ msg: "Name and Email has been changed" })
    })

  }




}




function addProduct(id, title, price, description, image, res) {
  const QUERY = "INSERT INTO products (id, title, price, description, images) VALUES (?, ?, ?, ?, ?)"
  // console.log(JSON.parse(image))
  conector.query(QUERY, [id, title, price, description, JSON.stringify(image)], (err) => {
    if (err) console.log(err);
    res.send({ msg: "Product added successfully!" });

  })


}

const cloudinary = require('./Config/cloudinary.js');

function removeProduct(id, res) {

  const QUERY2 = "SELECT * FROM products WHERE id = ?"
  conector.query(QUERY2, [id], (err, rows) => {
    if (err) console.log(err);
    const data = JSON.parse(JSON.stringify(rows));
    const { images } = data[0]
    const imagesArray = JSON.parse(images)
    imagesArray.forEach(image => {
      cloudinary.uploader.destroy(image.public_id, (err, result) => {
        if (err) console.log(err);
        console.log(result)
      })
    })

  })

  const QUERY = "DELETE FROM products WHERE id = ?"
  conector.query(QUERY, [id], (err) => {
    if (err) console.log(err);
    res.send({ msg: "Product removed successfully!" });
  })
}


const getMostPopularProducts = (res) => {

  const QUERY1 = "SELECT productID, AVG(rating)  as mean_rating, COUNT(*) as num_ratings FROM rating GROUP BY productID ORDER BY mean_rating DESC LIMIT 4;"
  conector.query(QUERY1, (err, rows) => {
    if (err) console.log(err);
    const data = JSON.parse(JSON.stringify(rows));

    if (data.length > 0) {
      const QUERY2 = "SELECT * FROM products WHERE id IN (?, ?, ?, ?)";

      console.log(data[0].productID)
      console.log(data[1].productID)
      console.log(data[2].productID)
      // res.status(201).send({ data })
      conector.query(QUERY2, [data[0].productID, data[1].productID, data[2].productID, data[3].productID], (err, rows2) => {
        if (err) console.error(err);
        const product = JSON.parse(JSON.stringify(rows2));
        console.log("product");
        res.status(201).send({ product, data })
      })

    }
  }
  )
}

const getLastProducts = (res) => {
  const QUERY = "SELECT * FROM products ORDER BY id DESC LIMIT 4;"
  conector.query(QUERY, (err, rows) => {
    if (err) console.log(err)
    const products = JSON.parse(JSON.stringify(rows));
    res.status(201).send({ products })
  })
}



//const QUERY = "SELECT * FROM users where email="


module.exports = { getProductByID, removeProduct, AdminLogin, LoginUser, getUser, RegisterUser, getDecodedToken, getProduct, getProductInformation, conector, addProduct, getAllProducts, getAllUsers, getRamdomProducts, getMostPopularProducts, getLastProducts, setOrder, getOrdersbyUserID, UpdatePassword, UpdateEmail };

