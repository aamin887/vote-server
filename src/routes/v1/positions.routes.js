const express = require("express");
const router = express.Router();
const positionController = require("../../controllers/position.controller");


router
  .route("/")
  .post(positionController.addPositions)
  .get(positionController.getPositions);

router
  .route("/:id")
  .put(positionController.updatePositions)
  .delete(positionController.deletePositions)
  .get(positionController.getPosition);

module.exports = router;
