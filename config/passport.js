const passport = require("passport");
const pool = require("../config/db");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback",
},
    async (_, __, profile, done) => { // ignored access token and refresh token coming from google _ = access token and __ = refresh token
        try {
            const googleId = profile.id
            const full_name = profile.displayName
            const email = profile.emails[0].value
            const existingUser = await pool.query(
                "SELECT * FROM users WHERE google_id = $1 OR email = $2",
                [googleId, email]
            );
            let user;
            if (existingUser.rows.length > 0) {
                user = existingUser.rows[0];
            }
            else{
                const newUser = await pool.query(
                    `INSERT INTO users (google_id,full_name,email, is_verified) VALUES ($1,$2,$3,$4) RETURNING *`,
                    [googleId, full_name, email, true]
                )
                user = newUser.rows[0];
            }
            // const user = newUser.rows[0]
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            await pool.query("UPDATE users SET refresh_token = $1 WHERE id=$2", [refreshToken, user.id])
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            return done(null, user)
        } catch (error) {
            return done(error, null)
        }
    }
));

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))