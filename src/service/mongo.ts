import mongoose from "mongoose";

export async function connectToDB(): Promise<boolean> {
  try {
    switch (mongoose.connection.readyState) {
      case 1:
      case 2:
        // console.log("mongoose connected already");
        return true;

      default:
        const url = process.env.MONGO_URI || "";
        const state = await mongoose.connect(url, {
          dbName: process.env.MONGO_DATABASE,
        });
        console.log(url);
        return state.connection.readyState === 1;
    }
  } catch (error) {
    console.log("from mongo");
    process.exit(1);
  }
}

export function closeDBConnection() {
  try {
    if (mongoose.connection.readyState === 1) mongoose.disconnect();
  } catch (error) {
    console.log("from mongo");
    process.exit(1);
  }
}
