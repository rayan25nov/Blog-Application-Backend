import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const requireAuth = (req, res, next) => {
  const cookie = req.cookies.jwt;
  if (!cookie) {
    return res.status(401).json({ message: "No token in cookie" });
  }
  jwt.verify(cookie, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    // If the token is valid, set the user in the request and call the next middleware
    req.user = decoded;
    next();
  });
};

export default requireAuth;
