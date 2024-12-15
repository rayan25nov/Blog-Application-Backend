// swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import dotenv from "dotenv";
dotenv.config();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog Application API",
      version: "1.0.0",
      description: "API documentation for the Blog application",
    },
    servers: [
      {
        url: `${process.env.SERVER_URL}`, // Base URL for the API
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to your route files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
