import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/utn_node_tp3");
    console.log("Connection DB - OK");
  } catch (error) {
    console.log("Connection DB - ERROR");
    process.exit(1);
  }
};

export { connectDb };
