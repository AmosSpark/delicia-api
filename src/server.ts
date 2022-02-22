import "module-alias/register";

import morgan from "morgan";
import * as dotenv from "dotenv";
import { app } from "./app";

// Environment Variables Configuration
dotenv.config();

// Database Configuration
import "./resources/models/db_config/db.config";

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Server
const PORT: number = Number(process.env.PORT) || 5000;

if (!process.env.PORT) {
  console.log(`App port not found`);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`App now listening on port ${PORT}`);
});
