const jwt = require("jsonwebtoken");

exports.generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role, full_name:user.full_name, is_verified:user.is_verified },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY }
    );
};

exports.generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY }
    )
}
