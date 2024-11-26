const express = require("express");
const router = express.Router();
const positionController = require("../../controllers/api/position.controller");

router
  .route("/")
  .post(positionController.addPosition)
  .get(positionController.getPositions);

router
  .route("/:id")
  .get(positionController.getPosition)
  .put(positionController.updatePositions)
  .delete(positionController.deletePositions);
//
module.exports = router;
