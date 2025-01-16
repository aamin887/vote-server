const express = require("express");
const router = express.Router();
const userController = require("../../controllers/auth/user.controller");
const auth = require("../../middleware/auth.middleware");
const uploads = require("../../config/upload.config");

router.post("/login", userController.login);
router.post("/register", userController.register);
router.post("/logout", userController.logout);
router.get("/refresh", userController.refresh);
router.put("/verify", userController.verify);
router.post("/request-new-password", userController.passwordRequest);
router.get("/token", userController.checkToken);
router.post("/change-password", userController.resetPassword);

router.get("/profile/:userId", auth, userController.profile);
router.put("/profile/:userId", auth, userController.updateProfile);

// verify voter
router.get("/voters", auth, userController.voters);
router.post("/verify-voter/:userId", userController.verifyVoter);

module.exports = router;
