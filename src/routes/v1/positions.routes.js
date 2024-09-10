const express = require("express");
const router = express.Router();
const positionController = require("../../controllers/position.controller");

router
  .route("/")
  .post(positionController.addPositions)
  .get(positionController.getAllPositions);

router
  .route("/:id")
  .get(positionController.getPositions)
  .put(positionController.updatePositions)
  .delete(positionController.deletePositions);

router.route("/elections/:id").delete(positionController.deleteManyPositions);

module.exports = router;
