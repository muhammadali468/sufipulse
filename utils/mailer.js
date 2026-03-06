require("dotenv").config()
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const emailHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SufiPulse OTP</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #0f111a;
        margin: 0;
        padding: 0;
        color: #ffffff;
    }
    p{
        color:white;
    }
    .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #1a1c2b;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 0 15px rgba(0,0,0,0.3);
    }
    .header {
        background-color: #0f111a;
        padding: 30px;
        text-align: center;
    }
    .header h1 {
        color: #00c78c;
        margin: 0;
        font-size: 28px;
    }
    .header p {
        color:white;
        margin-top: 5px;
        font-size: 14px;
    }
    .body {
        padding: 30px;
        text-align: center;
    }
    .body p {
        font-size: 16px;
        line-height: 1.6;
        margin: 15px 0;
    }
    .otp {
        display: inline-block;
        background-color: #1a1c2b;
        color: #00c78c;
        font-size: 24px;
        font-weight: bold;
        padding: 15px 25px;
        border-radius: 8px;
        margin: 20px 0;
        letter-spacing: 3px;
    }
    .footer {
        background-color: #0f111a;
        padding: 20px;
        font-size: 12px;
        color: #888;
        text-align: center;
    }
    @media only screen and (max-width: 600px) {
        .container { margin: 20px; }
        .header h1 { font-size: 24px; }
        .otp { font-size: 20px; padding: 12px 20px; }
    }
</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>SufiPulse</h1>
            <p>Access your sacred creative space</p>
        </div>
        <div class="body">
            <p>Welcome back,</p>
            <p>Use the one-time code below to sign in to your SufiPulse account.</p>
            <div class="otp">{{OTP_CODE}}</div>
            <p>This code is valid for <b>10 minutes</b>.</p>
            <p>If you did not attempt to sign in, you can safely ignore this message.</p>
        </div>
        <div class="footer">
            &copy; 2026 SufiPulse<br>
            This is an automated message. Please do not reply.
        </div>
    </div>
</body>
</html>`

exports.sendOTPEmail = async (email, otp) => {
    try {
        const info = await transporter.sendMail({
            from: `SufiPulse <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Email Verification OTP",
            html: emailHTML.replace("{{OTP_CODE}}", otp),
        });
        return { success: info.accepted.length > 0, info }; // Return status
    } catch (err) {
        console.error("Error sending email: ", err);
        return { success: false, error: err };
    }
}

exports.passwordResetOTPEmail = async (email, otp) => {
    try {
        const info = await transporter.sendMail({
            from: `SufiPulse <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Password Reset OTP",
            html: emailHTML.replace("{{OTP_CODE}}", otp),
        });
        return { success: info.accepted.length > 0, info }; // Return status
    } catch (err) {
        console.error("Error sending email: ", err);
        return { success: false, error: err };
    }
}