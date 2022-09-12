import express from "express";
import { conn } from "./mysql_conector.js"; 
const app = express();



app.get('/', (req, res) => {
    conn(); 
}
)

app.listen(3001, () => {
    console.log("Server is running on port 3001! Everything is working")
}); 
