const jwt = require("jsonwebtoken");
const pool = require("../config/db"); // your PostgreSQL pool

// Middleware to verify JWT and email verification
exports.verifyWriter = async (req, res, next) => {
  try {
    const user = req.user; // assume JWT middleware sets req.user
    // check if user has approved writer profile
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM writer_profiles WHERE user_id=$1 AND profile_status='approved'",
      [user.id]
    );
    client.release();

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "You are not an approved writer" });
    }

    req.writerId = result.rows[0].id;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};