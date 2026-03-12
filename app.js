require("dotenv").config()
require("./config/passport")
const express = require("express");
const pool = require("./config/db")
const app = express()
const session = require("express-session")
const authRoutes = require("./routes/auth.routes");
const writerRoutes = require("./routes/writer.routes");
const kalamRoutes = require("./routes/kalam.routes");
const vocalistRoutes = require("./routes/vocalist.routes");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const cors = require("cors")
app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        origin:"http://localhost:3000",
        credentials:true
    }
))
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
}));

app.use(passport.initialize())
app.use(passport.session())

app.use("/api/auth", authRoutes)
app.use("/api/writer", writerRoutes)
app.use("/api/kalam", kalamRoutes)
app.use("/api/vocalist", vocalistRoutes)



// localhost:5000
app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            message:"Database connected",
            time: result.rows[0]
        })
    } catch (error) {
            console.log(error)
    }
})


module.exports = app