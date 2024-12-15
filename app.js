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


// Importing the Database Connection
import dbConnection from "./db/config.js";
dbConnection();
// Importing the Cloudinary Connection
import cloudinaryConnect from "./db/cloudinary.js";
cloudinaryConnect();

// Serve static files if required (e.g., Swagger-UI assets)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticPath = path.resolve(__dirname, "static");
app.use(express.static(staticPath));
//swagger doc
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

//Importing the Post Routes
import postRoutes from "./routes/postRoute.js";
app.use("/posts", postRoutes);


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
