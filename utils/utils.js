import mongoose from "mongoose";

export const checkMongoIdValidity = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const convertStringToMongoId = (id) => {
  const isValid = checkMongoIdValidity(id);

  if (!isValid) {
    console.log("Not valid");
    return;
  }

  const mongoId = new mongoose.Types.ObjectId(id);

  return mongoId;
};
