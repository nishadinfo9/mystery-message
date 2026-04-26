import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("database already connected");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODBURI || "", {});
    console.log("database log", db);

    connection.isConnected = db.connections[0].readyState;
    console.log("db connections log", db.connections);
    console.log("database connected successfully");
  } catch (error) {
    console.log("database connection failed: ", error);
    process.exit(1);
  }
}

export default dbConnect;
