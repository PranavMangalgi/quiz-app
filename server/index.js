const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const pollRoutes = require("./routes/pollRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", authRoutes);
app.use("/", quizRoutes);
app.use("/", pollRoutes);

app.use((req, res) => {
  res.send("404, route not found");
});

app.use(errorHandler);

app.listen(port, () => {
  connectDB(process.env.DB_URL)
    .then(() =>
      console.log(`db connected, server running at http://localhost:${port}`)
    )
    .catch((e) => console.error(e));
});
