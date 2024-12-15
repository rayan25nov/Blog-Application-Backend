import express from "express";
const app = express();
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
dotenv.config();
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importing the Database Connection
import dbConnection from "./db/config.js";
dbConnection();
// Importing the Cloudinary Connection
import cloudinaryConnect from "./db/cloudinary.js";
cloudinaryConnect();

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Serve static files from node_modules/swagger-ui-dist
app.use(
  "/api-docs",
  express.static(path.join(__dirname, "node_modules", "swagger-ui-dist"))
);

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Importing the user Routes
import userRoutes from "./routes/userRoute.js";
app.use("/users", userRoutes);

// Importing the Post Routes
import postRoutes from "./routes/postRoute.js";
app.use("/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
