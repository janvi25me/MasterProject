import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import HttpError from "../models/http-error.js";
import User from "../models/user.js";

export const getAllUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Fetching users failed...!", 500);
    return next(error);
  }
  res.json({ users: users });
};

export const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid input passes,please check your data", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing up failed", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User already exists, please login instead",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not create user, try again", 500);
    return next(error);
  }

  const createUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    await createUser.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong,try signing up again",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createUser.id, email: createUser.email },
      "SECRETKEY",
      { expiresIn: "5d" }
    );
  } catch (err) { 
    const error = new HttpError(
    "Something went wrong,try signing up again",
    500
  );
return next(error)}

  res.status(201).json({ userId: createUser.id, email: createUser.email, token: token });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Loggining in failed, try again later", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in",
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, check your credentials, try again",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in",
      401
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "SECRETKEY",
      { expiresIn: "5d" }
    );
  } catch (err) { 
    const error = new HttpError(
    "Something went wrong,try logging in again",
    500
  );
return next(error)}

  res.json({userId: existingUser.id,
    email: existingUser.email, 
    token: token
   });
};
