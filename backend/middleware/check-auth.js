import HttpError from "../models/http-error.js";
import jwt from "jsonwebtoken";

export default (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      throw new Error("Authentication failed");
    }
    const decodedToken = jwt.verify(token, "SECRETKEY");
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    if (!token) {
      const error = new HttpError("Authentication failed", 401);
      return next(error);
    }
  }
};
