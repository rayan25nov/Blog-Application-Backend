import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const requireAuth = async (req, res, next) => {
  try {
    // console.log(req.headers);
    const token =
      req.cookies.jwt ||
      req.body.token ||
      req.headers.authorization.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token in cookie", success: false });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode);
    req.user = decode;
    next();
  } catch (error) {
    // console.log(error);
    return res
      .status(401)
      .json({ message: "Invalid token", success: false, err: error.message });
  }
};

// Is Admin
const requireAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res
        .status(401)
        .json({ message: "Not authorized", success: false });
    }
    next();
  } catch (error) {
    // console.log(error);
    return res
      .status(401)
      .json({ message: "User role cannot be verified", success: false });
  }
};

const requireUser = (req, res, next) => {
  try {
    if (req.user.role !== "User") {
      return res
        .status(401)
        .json({ message: "Not authorized", success: false });
    }
    next();
  } catch (error) {
    // console.log(error);
    return res
      .status(401)
      .json({ message: "User role cannot be verified", success: false });
  }
};

export { requireAuth, requireAdmin, requireUser };
