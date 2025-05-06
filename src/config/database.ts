import mongoose from "mongoose";

export const databaseConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Database working correctly!");
  } catch (error) {
    console.error("Error trying to connect to the database", error);
    process.exit(1);
  }
};
