import fs from "fs";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import HttpError from "../models/http-error.js";
import { getCoordsForAddress } from "./utils/location.js";
import Place from "../models/place.js";
import User from "../models/user.js";

export const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  // console.log("placeid is", placeId)
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Couldnot find place for the provided id", 404);
    return next(error);
  }

  res.json({ place });
};

export const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  // console.log("user id",userId)
  // let places
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate("places");
    // console.log(userWithPlaces.places)
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later!",
      500
    );
    return next(error);
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError("Couldnot find places for the provided user id", 404)
    );
  }

  res.json({ places: userWithPlaces.places });
};

export const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError("Invalid inputs passes, please check your data", 422));
  }
  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating place failed", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }
  // console.log(user);

  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError(
      "Cannot create new place here, please try again...!",
      500
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating place failed, try again", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

export const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passes, please check your data", 422)
    );
  }
  const { title, description } = req.body;
  // console.log(req.body)
  const placeId = req.params.pid;
  // console.log("placeId", placeId)
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Could not update", 500);
    return next(error);
  }

  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError("You are not allowed to edit this place", 401);
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError("Somethng went wrong", 500);
    return next(error);
  }

  res.status(200).json({ place });
};

export const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the place id",
      500
    );
    return next(error);
  }

  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    await place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Something went wrong, could not delete", 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for this id", 404);
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this place",
      401
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted successfully...!" });
};

