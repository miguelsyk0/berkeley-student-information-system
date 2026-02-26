require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRouter = require("./routes/auth");

const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(cors({ origin: "http://localhost:5173" })); // allow front-end origin
app.use(express.json());

// mount routers
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Back-end running");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
