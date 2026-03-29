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

// Health check endpoint (Public)
app.get("/api/health", async (req, res) => {
  try {
    const db = require("./db");
    // Simple query to verify DB connectivity
    await db.one("SELECT 1 as connected");
    res.json({ 
      status: "ok", 
      database: "connected",
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || "development"
    });
  } catch (err) {
    res.status(500).json({ 
      status: "error", 
      database: "disconnected", 
      message: err.message 
    });
  }
});

app.get("/", (req, res) => {
  res.send("Back-end running via Firebase Functions");
});

// For local development compatibility outside of Firebase emulator
if (require.main === module) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Local development server listening on port ${port}`);
  });
}

exports.api = functions
  .region("asia-southeast1")
  .runWith({
    timeoutSeconds: 120,
    memory: "1GB"
  })
  .https.onRequest((req, res) => {
    // Force production environment in Cloud Function context
    process.env.NODE_ENV = "production";
    return app(req, res);
  });