import mysql from "mysql";
import "dotenv/config";
import bcrypt from "bcrypt";
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
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

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

const LoginUser = (email, password, res, accessToken, refreshToken) => {

  //CHECK IF EMAIL EXITS. GOOGLE LOGIN. 
  if(password == undefined){
    var CHECKEMAIL = "SELECT * FROM users WHERE email = '" + email + "'";
    conector.query(CHECKEMAIL, (err, rows) =>{
      if(err) throw err;
      if(rows.length > 0) {res.status(200).send({msg: "Success", accessToken: accessToken, refreshToken: refreshToken});}else{ 
        RegisterUser(name, email, password, res, accessToken, refreshToken);
      }

    })
    //CHECK IF EMAIL AND PASSWORD EXITS.
  }else{ 


    var CHECK  = "SELECT * FROM users WHERE email = '" + email + "'";



    conector.query(CHECK, async (err, rows) =>{
      if (err) throw err;
      if(rows.length > 0) {
        // res.status(200).send({msg: "Success", accessToken: accessToken, refreshToken: refreshToke});
        let passwordHash = JSON.parse(JSON.stringify(rows));
        passwordHash = passwordHash[0].password
        console.log(passwordHash)
       let pass = bcrypt.compare(password, passwordHash).then(response => {
        res.status(201).send({msg: "Success", accessToken: accessToken, refreshToken: refreshToken});
       }).catch(err => {
        res.status(401).send({msg: "Email or password invalid"})  
      })
        console.log(pass)

      }else{
        res.status(401).send({msg :"Someting wrong with the email or password"})
      }
    })
  }
}


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


export { conector, RegisterUser, conn, getUser, LoginUser };
