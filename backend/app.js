import fs from "fs";
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import placesRoutes from "./routes/places-routes.js";
import usersRoutes from "./routes/users-routes.js";
import HttpError from "./models/http-error.js";
import dotenv from "dotenv";

const app = express();

app.use(bodyParser.json());

dotenv.config();

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/places", placesRoutes);

app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Coudnot find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured" });
});

mongoose
  .connect(process.env.MONGODBURL)
  .then(() => {
    console.log("Database connected successfully...!");
  })
  .catch((err) => console.log(err));

app.listen(5000, (req, res) => {
  console.log("Server is started on port 5000");
});
