import mongoose from "mongoose";

const { DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

export const db_connect = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USERNAME}:${encodeURIComponent(
        DB_PASSWORD
      )}@school.b6qkdnb.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
    );

    console.log("DB connection OK");
  } catch (error) {
    console.log("DB connection failed");
    console.log(error.message);
  }
};
