import dotenv from "dotenv";
import db from "./db/db.js";
import app from "./app.js";
import mongoose from "mongoose";

dotenv.config();
db.on("error", (err) => console.log("Error :>> ", err));
db.once("open", () => console.log("Connected to Database"));

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server listening at http://localhost:" + port);
});
