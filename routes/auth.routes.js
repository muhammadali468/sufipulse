const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate.middleware")
const router = express.Router()
const authController = require("../controllers/auth.controller");
const passport = require("passport");

// http:localhost:5000/api/auth/register
router.post("/register", [
    body("full_name").notEmpty().withMessage("Full Name is required!"),
    body("email").notEmpty().withMessage("Email is required!"),
    body("password").isLength({ min: 6 }).withMessage("Password must be atleast 6 charaters"),
], validate, authController.register)

// http:localhost:5000/api/auth/verify-otp
router.post("/verify-email", [
    body("email").notEmpty().withMessage("Email is required!"),
    body("otp").isLength({ min: 6 }).withMessage("OTP must be atleast 6 charaters"),
], validate, authController.verifyEmail)

// Oauth google

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }, ), authController.googleLogin)
// http:localhost:5000/api/auth/login
router.post("/login", [
    body("email").notEmpty().withMessage("Email is required!"),
    body("password").notEmpty().withMessage("Password is required!"),
], validate, authController.login)

// http:localhost:5000/api/auth/refresh-token
router.post("/refresh-token", authController.refreshToken)
// http:localhost:5000/api/auth/logout
router.post("/logout", authController.logout)
// http:localhost:5000/api/auth/reset-password-otp
router.post("/reset-password-send-otp", authController.resetPasswordSendOtp)
// http:localhost:5000/api/auth/verify-password-otp
router.post("/reset-password-verify-otp", authController.resetPasswordVerifyOtp)
// http:localhost:5000/api/auth/reset-password-via-otp
router.post("/reset-password-via-otp", authController.resetPasswordViaOtp)

module.exports = router