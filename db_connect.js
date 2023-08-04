import mongoose from "mongoose";

const { DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

// create db_url
const db_url = `mongodb+srv://${DB_USERNAME}:${encodeURIComponent(
  DB_PASSWORD
)}@school.b6qkdnb.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

export const db_connect = async () => {
  try {
    await mongoose.connect(db_url);
    console.log("DB connection OK");
  } catch (error) {
    console.log("DB connection failed");
    console.log(error.message);
  }
};
