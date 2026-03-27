require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


const authRouter = require("./routes/auth");
const schoolRouter = require("./routes/school");
const studentsRouter = require("./routes/students");
const subjectsRouter = require("./routes/subjects");
const importsRouter = require("./routes/imports");
const gradesRouter = require("./routes/grades");
const sf10Router = require("./routes/sf10");

const port = process.env.PORT || 4000;

// middleware
app.use(cors({ origin: "http://localhost:5173" })); // allow front-end origin
app.use(express.json());

// mount routers
app.use("/api/auth", authRouter);
app.use("/api", schoolRouter);
app.use("/api", studentsRouter);
app.use("/api", subjectsRouter);
app.use("/api", importsRouter);
app.use("/api", gradesRouter);
app.use("/api", sf10Router);

app.get("/", (req, res) => {
  res.send("Back-end running");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
