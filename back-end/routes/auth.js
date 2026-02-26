const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // call stored procedure
    const result = await db.one(
      "SELECT register_user($1, $2, $3) AS result",
      [username, hashedPassword, email || null]
    );

    const { user_id, status, message } = result.result;

    if (status === "error") {
      return res.status(409).json({ error: message });
    }

    return res.status(201).json({ message, user: { id: user_id, username } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }

    // call stored procedure to get user
    const user = await db.one(
      "SELECT * FROM get_user_for_login($1)",
      [username]
    );

    if (!user || !user.id) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    // verify password with bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    // in real app you'd issue a JWT token here
    return res.json({ message: "logged in", user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
