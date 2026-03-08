const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate.middleware")
const router = express.Router()
const kalamController = require("../controllers/kalam.controller");
const { verifyWriter } = require("../middleware/writer.middleware");
const { verifyUser, verifyAdmin } = require("../middleware/auth.middleware");

router.post("/create", [
    body("title").notEmpty().withMessage("Title is required!"),
    body("content").notEmpty().withMessage("Content is required!"),
], validate, verifyUser, verifyWriter, kalamController.create)

router.get("/get-all", verifyUser, verifyAdmin, kalamController.getAllKalamsAdmin)
router.get("/get-all-user", verifyUser, kalamController.getUserKalams)

module.exports = router