import mysql from "mysql";

const conector = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ayawma",
});

const conn = () => {
  conector.connect((err) => {
    if (err) throw err;
    console.log("Database has been connected");
  });
};

const RegisterUser = (userName, email, password, googleToken, res) => {
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
      return res.status(200).send({ msg: "Successfully registered" });
    });

  });
};

const getusers = () => {
  conector.connect();
  conector.query("SELECT * FROM users", (error, results, fields) => {
    if (error) throw error;
  });
};

export { conector, RegisterUser, conn };
