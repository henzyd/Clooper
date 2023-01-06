import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const option = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.connect(process.env.DB_CONNECTION_STRING);
const db = mongoose.connection;
console.log(db.db);

export default db;
