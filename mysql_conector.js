import mysql from "mysql";
import "dotenv/config";
import jwt from "jsonwebtoken";

const conector = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const conn = () => {
  conector.connect((err) => {
    if (err) throw err ;
    console.log("Database has been connected");
  });
};

const RegisterUser = (userName, email, password, googleToken, res, accessToken, refreshToken) => {
  //CHECK IF  USER HAS ALEREADY REGISTERED.

  var CHECKUSER = "SELECT * FROM users WHERE email = '" + email + "'";
  conector.query(CHECKUSER, (err, rows) => {
    if (err) throw err;
    if (rows.length > 0) {
      return res.status(400).send({ msg: "USER ALEREADY REGISTERED" });
    }
    
    
    var QUERY =
      "INSERT INTO users (name, email, password, token) VALUES (?, ?, ?, ?)";

    conector.query(QUERY, [userName, email, password, googleToken], (error) => {
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

const getDecodedToken = (request, response) => {
  const authorization = request.get("Authorization");
  let token = "";
  if (authorization && authorization.toLocaleLowerCase().startsWith("bearer")) {
    token = authorization.substring(7);
  }
  let decodeToken = {}; 
  try { 
    decodeToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  }catch{}
  
  return decodeToken;
};

//TODO: Validate refreshToken and send user information to the client.
const getUser = (request, response) => {
  const decodedToken = getDecodedToken(request, response);
  let i = 1
  console.log("Entre aqui: "+i++)
  response.send({
    decodedToken,
  });

  }; 

  //const QUERY = "SELECT * FROM users where email="


export { conector, RegisterUser, conn, getUser };
