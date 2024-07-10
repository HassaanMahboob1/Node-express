import express, { Application } from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import dataRoutes from "./routes/dataroutes";
import { authenticateToken } from "./middleware/authmiddleware";

const app: Application = express();
const PORT: number = 3000;

// Middleware
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", dataRoutes);

// MongoDB connection
const MONGO_URI: string = "mongodb://localhost:27017";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
