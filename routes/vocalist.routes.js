const express = require("express");
const router = express.Router();

const vocalistController = require("../controllers/vocalist.controller");
// const verifyUser = require("../middlewares/auth");
const { verifyAdmin, verifyUser } = require("../middleware/auth.middleware");

router.post("/create", verifyUser, vocalistController.vocalistProfileCreate);

router.get("/read", verifyUser, vocalistController.vocalistProfileRead);

router.patch("/update", verifyUser, vocalistController.vocalistProfileUpdate);

router.delete("/delete", verifyUser, vocalistController.vocalistProfileDelete);

router.get("/all", verifyUser, verifyAdmin, vocalistController.vocalistGetAll);

router.patch(
    "/update-status/:id",
    verifyUser,
    verifyAdmin,
    vocalistController.updateVocalistStatus
);

module.exports = router;