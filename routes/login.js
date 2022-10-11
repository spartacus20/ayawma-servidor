import "dotenv/config";
import express from 'express';
import { LoginUser } from "../mysql_conector.js";

const router = express.Router();

router.post("/users/login", async (req, res) => 
{
  
  const { body } = req;
  const name = body.username;
  const email = body.email;
  const password = body.password;
  console.log(password)

  LoginUser(email, password, res, name); 

})

export default router; 