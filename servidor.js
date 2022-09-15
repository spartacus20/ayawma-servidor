import express from "express";
import session from "express-session";
import cors from "cors";
import { RegisterUser, conector, conn } from "./mysql_conector.js";
import bodyParser from "body-parser";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "session",
    cookie: {
      maxAge: 3000 * 24 * 60 * 60,
      sameSite: "none",
      secure: true,
    },
  })
);

app.use(bodyParser.json());

//save name as cookie
app.post("/users/register", async (req, res) => {
  try {
    //getting variables from body of the request.
    const name = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const googleToken = req.body.googleToken;

    if (password == undefined) {
      //check if is a google registration.
      RegisterUser(name, email, "NULL", googleToken, res);
    }
    RegisterUser(name, email, password, googleToken, res);


  } catch (e) {
    console.log(e);
  }
});

//decode cookies
app.get("/users/login", async (req, res) => {
  try {
    console.log(req.session.name);
    res.send({ message: req.session.name });
  } catch (error) {
    console.log(error);
  }
});

app.listen(3001, () => {
  conn(); 
  console.log("Server is running on port 3001! Everything is working");
});
