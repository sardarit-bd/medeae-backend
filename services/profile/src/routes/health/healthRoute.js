import express from "express";


const router = express.Router();

/********* Import Here Controller Files **********/
import { health } from '../../controllers/healthContorller/healthController.js';
import { authorize, protect } from "../../middlewares/authMiddleware.js";
import { errorHandler, notFound } from "../../middlewares/errorMiddleware.js";



router.get("/health", health);



router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});





/*********** Global Error Handling Middleware *************/
router.use(notFound);
router.use(errorHandler);





export default router;
