const express = require("express");
const { body } = require("express-validator");
const validateMiddleware = require("../middleware/validate.middleware");
const { verifyUser, verifyAdmin } = require("../middleware/auth.middleware");
const router = express.Router();
const sadaController = require("../controllers/sada.controller");

router.post(
  "/create",
  [
    body("title").notEmpty().withMessage("Title is required!"),
    body("language").notEmpty().withMessage("Language is required!"),
    body("performance_style").notEmpty().withMessage("Performance style is required!"),
    body("link").notEmpty().withMessage("Link is required!")
  ],
  validateMiddleware,
  verifyUser,
  sadaController.create
);

router.get(
  "/get-all",
  verifyUser,
  verifyAdmin,
  sadaController.getAllSadasAdmin
);

router.get(
  "/get-all-user",
  verifyUser,
  sadaController.getUserSadas
);

router.put(
  "/:sadaId",
  verifyUser,
  sadaController.updateSada
);

router.delete(
  "/:sadaId",
  verifyUser,
  sadaController.deleteSada
);

router.patch(
  "/update-status/:id",
  verifyUser,
  verifyAdmin,
  sadaController.updateSadaStatus
);

module.exports = router;