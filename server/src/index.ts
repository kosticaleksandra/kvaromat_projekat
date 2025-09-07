import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env") });

import "./db/pool";  
import app from "./app"; 

const port = Number(process.env.PORT) || 4000;

console.log("JWT_SECRET set?", !!process.env.JWT_SECRET);

app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
