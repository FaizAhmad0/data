const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const loginRoute = require("./route/LoginRoute");
const userRoute = require("./route/userRoute");
const managerRoute = require("./route/managerRoute");
const adminRoute = require("./route/adminRoute");
const accountant = require("./route/AccountantRoute");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8500;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.json());

// Mount the login route
app.use("/login", loginRoute);
app.use("/user", userRoute);
app.use("/manager", managerRoute);
app.use("/admin", adminRoute);
app.use("/accountant",accountant);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database initialized successfully");

    app.listen(PORT, () => {
      console.log(`Server Initialized on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  });
