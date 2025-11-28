/****** core modules import here *******/
import cors from "cors";
import express from "express";



/*******internal files import here *******/
import authRoutes from './routes/authroute/authUserRoutes.js';
import checkRoutes from './routes/check/checkRoute.js';
import healthRoutes from "./routes/health/healthRoute.js";
import productRoutes from './routes/productroute/productRoute.js';
import profileRoutes from './routes/profile/profileRoute.js';
import userRoutes from './routes/userroute/userRoutes.js';



/****** express app initilazation here *******/
const app = express();



/********* Body Data Parse **********/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/*********** Middleware Here ***********/
app.use(cors());
app.use(express.json());




/********** check check Routes Define Here *********/
app.use("/", checkRoutes);






/********** auth Routes Define Here *********/
app.use("/", authRoutes);


/********** user Routes Define Here *********/
app.use("/", userRoutes);



/********** Product Routes Define Here *********/
app.use("/", productRoutes);



/********** Profile Routes Define Here *********/
app.use("/", profileRoutes);



/********** health check Routes Define Here *********/
app.use("/", healthRoutes);






/******* Export the module ******/
export default app;
