const express = require("express");
const router = express.Router();
const userController = require("../../controllers/auth/user.controller");
const auth = require("../../middleware/auth.middleware");

router.post("/register", userController.register);
router.post("/register-voter", auth, userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/refresh", userController.refresh);
router.put("/verify", userController.verify);
router.post("/request-new-password", userController.passwordRequest);
router.post("/change-password", userController.resetPassword);
router.get("/profile/:userId", auth, userController.profile);
router.put("/profile/:userId", auth, userController.updateProfile);

// verify voter
router.post("/verify-voter/:userId", userController.verifyVoter);

module.exports = router;
