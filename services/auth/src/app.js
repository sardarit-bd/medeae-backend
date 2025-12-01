/****** core modules import here *******/
import cors from "cors";
import express from "express";
import passport from 'passport';
import './config/passport.js';



/*******internal files import here *******/
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import authRoutes from './routes/authroute/authUserRoutes.js';
import healthRoutes from "./routes/health/healthRoute.js";

/****** express app initilazation here *******/
const app = express();

app.use(passport.initialize());
// app.use(passport.session());

/********* Body Data Parse **********/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/*********** Middleware Here ***********/
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log("🔥 Incoming request:");
    console.log("Method:", req.method);
    console.log("Path:", req.path);
    console.log("Original URL:", req.originalUrl);
    console.log("From:", req.headers['x-forwarded-for']);
    console.log("Gateway sent host:", req.headers.host);
    next();
});

app.use("/hi", (req, res) => {
    res.send("Hello from Auth Service 👋");
})


/********** auth Routes Define Here *********/
app.use("/", authRoutes);
/********** health check Routes Define Here *********/
app.use("/", healthRoutes);


app.use(errorHandler);
app.use(notFound);


/******* Export the module ******/
export default app;
