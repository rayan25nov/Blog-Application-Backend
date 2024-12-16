# Blog Application Backend

This is the backend for a blog application that provides user authentication, post management, and other essential features. The application is built using Node.js, Express, and MongoDB and includes Swagger API documentation.

## 📑 Table of Contents

- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Folder Structure](#-folder-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Scripts](#-scripts)
- [License](#-license)

## 🚀 Features

- User Authentication and Authorization
  - Sign up, Sign in, and Password Reset functionality
- Post Management
  - Create, Read, Update, and Delete posts
- Comment and Like functionality for posts
- File uploads using Multer and Cloudinary
- Token-based authentication using JWT
- API documentation using Swagger

## 🛠️ Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT (jsonwebtoken)**
- **Cloudinary**
- **Multer**
- **Nodemailer**
- **Swagger UI**

## 📂 Folder Structure

```
└── 📁blog-backend
    └── 📁controllers
        └── postController.js
        └── userController.js
    └── 📁db
        └── cloudinary.js
        └── config.js
    └── 📁middleware
        └── cloudinaryMiddleware.js
        └── userMiddleware.js
    └── 📁model
        └── commentModel.js
        └── likeModel.js
        └── postModel.js
        └── tokenModel.js
        └── userModel.js
    └── 📁routes
        └── postRoute.js
        └── userRoute.js
    └── 📁utils
        └── mailSender.js
    └── .env
    └── .gitignore
    └── app.js
    └── package-lock.json
    └── package.json
    └── readme.md
    └── swagger.js
    └── vercel.json
```

## ⚙️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rayan25nov/Blog-Application-Backend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd blog-backend
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables in a `.env` file (see below).

5. Start the development server:
   ```bash
   npm run dev
   ```

## 📄 Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
PORT=8080
DB_CNN=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BASE_URL=your_frontend_url eg: http://localhost:3000
SERVER_URL=your_api_url eg: http://localhost:8080
MAIL_HOST=your_smtp_host
MAIL_USER=your_smtp_user
MAIL_PASS=your_smtp_password
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

## 📖 API Documentation

Swagger documentation is available at `/api-docs`.

To view the documentation:

1. Start the server.
2. Navigate to `http://localhost:8080/api-docs` in your browser.

## 🔧 Scripts

- `npm run dev`: Start the server in development mode with Nodemon.
- `npm start`: Start the server in production mode.

## 📦 Dependencies

Here are the major dependencies used in the project:

```json
{
  "bcrypt": "^5.1.1",
  "cloudinary": "^1.41.0",
  "cookie-parser": "^1.4.6",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "express-fileupload": "^1.4.3",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.0.1",
  "multer": "^1.4.5-lts.1",
  "nanoid": "^5.0.3",
  "nodemailer": "^6.9.13",
  "swagger-jsdoc": "^6.2.8",
  "swagger-ui-express": "^5.0.1",
  "validator": "^13.11.0"
}
```

## 📜 License

This project is licensed under the ISC License.
