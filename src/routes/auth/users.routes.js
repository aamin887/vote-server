const express = require("express");
const router = express.Router();
const userController = require("../../controllers/auth/user.controller");
const auth = require("../../middleware/auth.middleware");
const Limiter = require("../../helpers/Limiter");

const limitLoginRequests = new Limiter({
  timeAllowed: 60000,
  maxTries: 5,
  fileName: "../logs/limiter.txt",
});

const limitPasswordRequests = new Limiter({
  timeAllowed: 90000,
  maxTries: 3,
  fileName: "../logs/limiter.txt",
});

router.post("/login", limitLoginRequests.rateLimit, userController.login);
router.post("/register", userController.register);
router.post("/logout", userController.logout);
router.get("/refresh", userController.refresh);
router.put("/verify", userController.verify);
router.post(
  "/request-new-password",
  limitPasswordRequests.rateLimit,
  userController.passwordRequest
);
router.get("/token", userController.checkToken);
router.put("/token", userController.checkToken);
router.post("/change-password", userController.resetPassword);

router.get("/profile/:userId", auth, userController.profile);
router.put("/profile/:userId", auth, userController.updateProfile);

// verify voter
router.get("/voters", auth, userController.voters);
router.post("/verify-voter/:userId", userController.verifyVoter);

module.exports = router;
