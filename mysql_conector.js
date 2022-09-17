import mysql from "mysql";
import "dotenv/config"
import jwt from "jsonwebtoken"


const conector = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const conn = () => {
  conector.connect((err) => {
    if (err) throw err;
    console.log("Database has been connected");
  });
};

const RegisterUser = (userName, email, password, googleToken, AccessToken, RefresToken) => {
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

    });

  });
};


const getDecodedToken = (request, response) => {

  const authorization = request.get('Authorization');
  console.log("Nada" + authorization);
  let token = ""

  if (authorization && authorization.toLocaleLowerCase().startsWith("bearer")) {
    token = authorization.substring(7)
  }

  const decodeToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)

  if(!token || !decodeToken.username){
    response.status(401).send({
      error: " Token missing or invalid"
    })
  }
  //return decodeToken;

}

//TODO: Validate refreshToken and send user information to the client. 
const getUser = (request, response,) => {

  const decodedToken = getDecodedToken(request, response)

  console.log(decodedToken)
};

export { conector, RegisterUser, conn, getUser };
