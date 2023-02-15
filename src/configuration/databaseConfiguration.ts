import mongoose from "mongoose";
import config from ".";

const connect = async () => {
  try {
    await mongoose.set("strictQuery", false);
    const connection = await mongoose.connect(config.MONGO_URL);
    console.log("Connecting to Database...");

    return connection;
  } catch (error) {
    console.error("Connection to Database failed!", error);
    process.emit("SIGTERM");
    process.exit(1);
  }
};

export default { connect };
