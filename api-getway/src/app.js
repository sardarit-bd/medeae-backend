import cors from "cors";
import express from "express";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import applyRoutes from "./routes/index.js";

const app = express();
app.use(cors());
app.use(express.json());

applyRoutes(app);

app.use(errorHandler);
app.use(notFound);

export default app;
