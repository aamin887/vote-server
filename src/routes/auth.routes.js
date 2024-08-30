const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const authController = require("../controllers/auth.controller");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/logout", authController.logout);
router.post("/password-reset", authController.reset);
router.post("/password-new-link", authController.newPassword);
router.post("/token", authController.checkToken);
router.get("/refresh", authController.refresh);
router.put("/accept-terms/:id", auth, authController.acceptTerms);

module.exports = router;
