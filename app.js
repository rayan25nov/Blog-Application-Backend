import express from "express";
const app = express();
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

// Importing the Database Connection
import dbConnection from "./db/config.js";
dbConnection();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Importing the Routes
import userRoutes from "./routes/userRoute.js";
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
