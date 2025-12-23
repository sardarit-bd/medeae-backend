/****** core modules import here *******/
import cors from "cors";
import express from "express";



/*******internal files import here *******/
import dosesRoutes from './routes/doses.route.js';
import healthRoutes from "./routes/health/healthRoute.js";
import medecineRoutes from './routes/medicines.route.js';
import patientRoutes from "./routes/patient/patientRoute.js";
import prescriptionRoutes from './routes/prescription.route.js';
import stockRoutes from './routes/stock.route.js';


/****** express app initilazation here *******/
const app = express();


app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
/********* Body Data Parse **********/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/*********** Middleware Here ***********/

app.use(express.json());




/********** Patient Routes Define Here *********/
app.use("/", patientRoutes);



/********** health check Routes Define Here *********/
app.use("/", healthRoutes);

app.use('/', prescriptionRoutes)
app.use("/", medecineRoutes)
app.use('/stock', stockRoutes)
app.use('/doses', dosesRoutes)




/******* Export the module ******/
export default app;
