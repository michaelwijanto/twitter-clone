import express from "express";
import auth from "./routes/auth.routes.js";

const app = express();

app.use("/api/auth", auth);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
