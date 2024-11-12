const express = require("express");
const router = express.Router();
const userController = require("../../controllers/auth/user.controller");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/refresh", userController.refresh);
router.post("/request-password", userController.passwordRequest);
router.post("/reset-password", userController.resetPassword);

module.exports = router;

module.exports = router;
