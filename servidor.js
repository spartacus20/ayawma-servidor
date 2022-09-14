import express from "express";
import session from "express-session";
import cors from "cors";
import { conn } from "./mysql_conector.js";
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

app.use(bodyParser.json())
//save name as cookie
app.post("/register", async (req, res) => {
  try {
    const name = req.body.username; 
    const email = req.body.email;
    console.log(email)
  } catch (error) {
    console.log(error);
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
  console.log("Server is running on port 3001! Everything is working");
});
