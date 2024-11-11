const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/auth/admin.controller");

router.post("/register", adminController.register);
router.post("/login", adminController.login);
router.get("/refresh", adminController.refresh);
router.post("/request-password", adminController.passwordRequest);
router.post("/reset-password", adminController.resetPassword);

module.exports = router;
