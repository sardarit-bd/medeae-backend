import app from "./app.js";
import environment from "./config/env.js";

/******** PORT Define *******/
const PORT = process.env.API_GATEWAY_PORT || 5000;


/*********** Start The Server ***********/
app.listen(PORT, () => {
  console.log(`API Getway Server running on port: ${PORT} in ${environment} mode`);
});
