/****** core modules import here *******/
import cors from "cors";
import express from "express";



/*******internal files import here *******/
import healthRoutes from "./routes/health/healthRoute.js";
import profileRoutes from './routes/profile/profileRoute.js';


/****** express app initilazation here *******/
const app = express();



/********* Body Data Parse **********/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/*********** Middleware Here ***********/
app.use(cors());
app.use(express.json());




/********** Profile Routes Define Here *********/
app.use("/", profileRoutes);



/********** health check Routes Define Here *********/
app.use("/", healthRoutes);




// health check
app.get("/", (req, res) => {
    res.status(200).json({
        status: "OK",
        service: "profile service",
        uptime: process.uptime(),
    });
});



/******* Export the module ******/
export default app;
