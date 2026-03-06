const authService = require("../services/auth.service");
const { sanitizeInput } = require("../utils/sanitize");
// Register a user
exports.register = async (req, res) => {
    try {
        const { full_name, email, password } = sanitizeInput(req.body);
        const result = await authService.registerUser(full_name, email, password);
        res.status(200).json(result.message)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
// Verify Email using OTP
exports.verifyEmail = async (req, res) => {
    try {
        const { email, otp } = sanitizeInput(req.body);
        const result = await authService.verifyOTP(email, otp);
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "prod",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = sanitizeInput(req.body);
        const result = await authService.loginService(email, password);
        if (result.accessToken) {
            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "prod",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            }).status(200).json({ messgae: result.message, accessToken: result.accessToken });
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
// Google Login
exports.googleLogin = async (req, res) => {
    try {
        res.cookie("refreshToken", req.user.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "prod",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.json({
            message: "Logged in with Google!",
            accessToken: req.user.accessToken,
            user: {
                id: req.user.id,
                email: req.user.email,
                name: req.user.full_name
            }
        })
    } catch (error) {
        console.log(error)
        throw Error(error)
    }

}

// Refresh Token 
exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const result = await authService.refreshTokenService(refreshToken);
        return res.cookie("refreshToken", result.newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "prod",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).status(200).json({ result })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
// Logout
exports.logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(200).json({ message: "Logged out" });
    try {
        const logoutUser = await authService.logoutService(refreshToken);
        res.clearCookie("refreshToken").status(200).json(logoutUser);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}
// Reset Password Send OTP
exports.resetPasswordSendOtp = async (req, res) => {
    const { email } = sanitizeInput(req.body)
    try {
        const result = await authService.resetPasswordSendOtpService(email);
        res.status(200).json(result)

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// Reset Password Verify OTP
exports.resetPasswordVerifyOtp = async (req, res) => {
    const { email, otp } = sanitizeInput(req.body)
    try {
        const result = await authService.resetPasswordVerifyOtpService(email, otp);
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.resetPasswordViaOtp = async (req, res) => {
    const { email, password, tempToken } = sanitizeInput(req.body)
    try {
        const result = await authService.resetPasswordViaOtpService(email, password, tempToken);
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}