const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth.controller");

router.get("/logout", authController.logout);
router.post("/token", authController.resetToken);

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/password-reset", authController.reset);
router.post("/password-new-link", authController.newPassword);
router.get("/refresh", authController.refresh);

module.exports = router;
