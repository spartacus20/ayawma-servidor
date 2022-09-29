import mysql from "mysql";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { response } from "express";

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

const RegisterUser = (userName, email, password, res, accessToken, refreshToken) => {
  //CHECK IF  USER HAS ALEREADY REGISTERED.

 
  var CHECKUSER = "SELECT * FROM users WHERE email = '" + email + "'";
  conector.query(CHECKUSER, (err, rows) => {
    if (err) throw err;
 
    if(password) {
      if (rows.length > 0) {
        return res.status(400).send({ msg: "USER ALEREADY REGISTERED" });
      }
    }
    
    console.log("Valor de password: "+password);
    var QUERY = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    conector.query(QUERY, [userName, email, password], (error) => {
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

const LoginUser = (email, password, res, name) => {

    var CHECK  = "SELECT * FROM users WHERE email = '" + email + "'";
    conector.query(CHECK, async (err, rows) =>{
      if (err) throw err;
      let accessToken = {}
      let refreshToken = {}
      const data = JSON.parse(JSON.stringify(rows));
      //console.log(rows.length)
    //WHEN THE USER USE GOOGLE AUTENTIFICATION
    if(password == undefined ){
     //WHEN THE USER USE GOOGLE AUTENTIFICATION AND HAVE AN ACCOUNT.       
      if(rows.length > 0){
        const Tokeninfo = {
          username: data[0].name,
          email: email
        }
        accessToken = jwt.sign(Tokeninfo, process.env.ACCESS_TOKEN_SECRET);
        refreshToken = jwt.sign(Tokeninfo,process.env.REFRESH_TOKEN_SECRET);
        res.status(200).send({msg: "Success", accessToken: accessToken, refreshToken: refreshToken});
        

      }else{ 
        
        const UserRegisterToken = {
          username: name, 
          email: email, 
        }
       // WHEN THE USER DONT HAVE ACCOUNT AND  USE GOOGLE AUTENTIFICATION
        accessToken = jwt.sign(UserRegisterToken, process.env.ACCESS_TOKEN_SECRET);
        refreshToken = jwt.sign(UserRegisterToken,process.env.REFRESH_TOKEN_SECRET)
        RegisterUser(name, email, "NULL", res, accessToken, refreshToken)
      }
       
    }else{
      
      //EVERYTHIN IS OK. 
      if(rows.length > 0){
        const Tokeninfo = {
          username: data[0].name,
          email: email
        }
        accessToken = jwt.sign(Tokeninfo, process.env.ACCESS_TOKEN_SECRET);
        refreshToken = jwt.sign(Tokeninfo,process.env.REFRESH_TOKEN_SECRET);
        let  passwordHash = data[0].password
        let pass = bcrypt.compare(password, passwordHash).then(response => {
        res.status(201).send({msg: "Success", accessToken: accessToken, refreshToken: refreshToken});
        }).catch(err => {res.status(401).send({msg: "Email or password invalid"})})

      }else{ 
        res.status(401).send({msg: "Email or password invalid"}) 
      }
      }
    }); 



  
}


const getDecodedToken = (request, response) => {
  const authorization = request.get("Authorization");
  let token = "";
  if (authorization && authorization.toLocaleLowerCase().startsWith("bearer")) {
    token = authorization.substring(7);
  }
  let decodeToken = {}; 

  decodeToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  return decodeToken;
};


const getProductInformation = (product, res) => {
   const QUERY = "SELECT * from products WHERE name='"+product+"'"

   conector.query(QUERY, (err, rows) => {
     if (err) throw err;
     const data = JSON.parse(JSON.stringify(rows));
    
     if(rows.length < 1){
         res.status(404).send({msg: "No product found"})
    }else{
        res.status(201).send({data})
     }

   })
}



const getDiscount = (res, code) => {
  
  const QUERY = "SELECT * FROM discount WHERE Code='"+code+"'"

  conector.query(QUERY, (err, rows) => {
    if (err) res.status(err).status(400).send({msg: "Something went wrong"}); 
    
    if(rows.length > 0){ 
      const data = JSON.parse(JSON.stringify(rows));
      res.status(201).send({data})
    }else{
       res.status(400).send({msg: "Discount code is not valid"});
    }
 
  })


}



const getProduct = (product, res) => { 
  const QUERY = "SELECT * FROM products WHERE name LIKE '%"+product+"%' OR description LIKE '%"+product+"%'"
 
  conector.query(QUERY,(err, rows) => {
    if(err) throw err; 
 
    const data = JSON.parse(JSON.stringify(rows));
    res.status(201).send({data})
  })
}

//TODO: Validate refreshToken and send user information to the client.
const getUser = (request, response) => {
  const decodedToken = getDecodedToken(request, response);
 
    response.send({
      decodedToken,
    });
  
  

  }; 

  //const QUERY = "SELECT * FROM users where email="


export { conector, RegisterUser, conn, getUser, LoginUser, getProduct, getProductInformation, getDiscount};
