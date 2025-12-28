import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import applyRoutes from "./routes/index.js";


const app = express();
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());

applyRoutes(app);

app.use(errorHandler);
app.use(notFound);

export default app;
