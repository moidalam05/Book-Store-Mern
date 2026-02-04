import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `✅ MongoDB Connected successfully... \n🧾 DB Name: ${connectionInstance.connection.name}`
    );
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
