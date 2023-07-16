const express = require("express");
const app = express();

const database = require("./config/database");

const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

// db connect
database.connect();

const PORT = process.env.PORT;

const userRoutes = require("./routes/Auth");

app.use("/api/v1", userRoutes);

app.listen(PORT, () => {
  console.log(`APP is listening on ${PORT}`);
});
