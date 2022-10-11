import express from 'express';
import { getUser } from "../mysql_conector.js";

const router = express.Router();

router.get("/api/user",  (req, res) => {
    getUser(req, res);
   });

export default router; 