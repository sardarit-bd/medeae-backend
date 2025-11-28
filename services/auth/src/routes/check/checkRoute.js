import express from "express";
import { readFileSync } from 'fs';
import path from 'path';


const router = express.Router();



router.get("/check", (req, res) => {

    console.log('hello......................');

    const dir = path.join(__dirname, '../../controllers/healthContorller/healthController.js');


    const data = readFileSync(dir, 'utf-8');


    console.log(data);


    res.json({
        success: true,
        message: "File Read Successfully",
    });

});







export default router;
