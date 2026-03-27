require("dotenv").config();
const express = require("express");
const cors = require("cors");
const functions = require("firebase-functions");

const authRouter = require("./routes/auth");
const schoolRouter = require("./routes/school");
const studentsRouter = require("./routes/students");
const subjectsRouter = require("./routes/subjects");
const importsRouter = require("./routes/imports");
const gradesRouter = require("./routes/grades");
const sf10Router = require("./routes/sf10");

const authMiddleware = require("./authMiddleware");

const app = express();

// middleware
app.use(cors({ origin: true })); // allow all origins to ease testing
app.use(express.json());

// mount routers
app.use("/api/auth", authRouter); // Public Auth Routes

// Every route after this middleware requires authentication
app.use("/api", authMiddleware);

app.use("/api", schoolRouter);
app.use("/api", subjectsRouter);
app.use("/api", importsRouter);
app.use("/api", gradesRouter);
app.use("/api", sf10Router);
app.use("/api", studentsRouter);

app.get("/", (req, res) => {
  res.send("Back-end running via Firebase Functions");
});

// For local development compatibility outside of Firebase emulator
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Local development server listening on port ${port}`);
  });
}

// Export the Express API as a Firebase Cloud Function
exports.api = functions.https.onRequest(app);
