const jwt = require("jsonwebtoken");
const pool = require("../config/db"); // your PostgreSQL pool

// Middleware to verify JWT and email verification
exports.verifyUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const userId = decoded.id;

        // Query the database to check if the user exists and email is verified
        const client = await pool.connect();
        try {
            const result = await client.query(
                "SELECT id, role, email, is_verified FROM users WHERE id=$1",
                [userId]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({ error: "User not found" });
            }

            const user = result.rows[0];

            if (!user.is_verified) {
                return res.status(403).json({ error: "Email not verified" });
            }

            // Attach user info to req.user
            req.user = {
                id: user.id,
                role: user.role,
                email: user.email
            };

            next();
        } finally {
            client.release();
        }
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
exports.verifyAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    if (!req.user.role.includes("admin")) {
        return res.status(403).json({ error: "Access denied: Admins only" });
    }

    next();
};