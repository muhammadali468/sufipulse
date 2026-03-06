const express = require("express");
const router = express.Router()
const { body } = require("express-validator");
const { verifyUser, verifyAdmin } = require("../middleware/auth.middleware");
const { writerProfileCreate, writerProfileRead, writerProfileUpdate, writerProfileDelete, writerGetAll } = require("../controllers/writer.controller");

// http:localhost:5000/api/writer/create-profile
router.post("/create-profile", verifyUser, writerProfileCreate)
// http:localhost:5000/api/writer/read-profile
router.get("/read-profile", verifyUser, writerProfileRead)
// http:localhost:5000/api/writer/read-profile
router.post("/update-profile", verifyUser, writerProfileUpdate)
// http:localhost:5000/api/writer/delete-profile
router.post("/delete-profile", verifyUser, writerProfileDelete)
// http:localhost:5000/api/writer/delete-profile
router.get("/get-all", verifyUser, verifyAdmin, writerGetAll)


module.exports = router