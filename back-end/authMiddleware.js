const admin = require("./firebaseAdmin");

/**
 * Express middleware to verify the ID token from Firebase on every request.
 * Expected header: Authorization: Bearer <token>
 */
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing/Invalid token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(401).json({
      error: "Unauthorized: Token verification failed",
      details: error.message,
      code: error.code
    });
  }
}

module.exports = authMiddleware;
