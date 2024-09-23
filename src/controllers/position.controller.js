const asyncHandler = require("express-async-handler");
const Positions = require("../model/position.model");
const Candidates = require("../model/candidates.model");
const Elections = require("../model/election.model");

/**
 * @Desc    Add positions
 * @Route   POST /api/v1/positions
 * @Access  Private
 */
const addPositions = asyncHandler(async function (req, res) {
  try {
    const { position, description, electionId } = req.body;

    if (!position || !description || !electionId) {
      res.status(400);
      throw new Error("fill all required fields");
    }

    const checkTitle = await Positions.findOne({
      positionName: position,
      electionId,
    });

    if (checkTitle) {
      return res.sendStatus(403);
    }

    const newPosition = await Positions.create({
      positionName: position,
      positionDescription: description,
      electionId: electionId,
    });

    if (newPosition) {
      await Elections.updateOne(
        { _id: electionId },
        {
          $push: { positions: newPosition._id },
        }
      );

      res.status(201).json({
        position: newPosition,
      });
    } else {
      return res.sendStatus(400);
    }
  } catch (error) {
    return res.sendStatus(400);
  }
});

/**
 * @Desc    Get a positions by election id
 * @Route   GET /api/v1/positions/:id
 * @Access  Private
 */
const getPositions = asyncHandler(async function (req, res) {
  const { election } = req.query;
  try {
    const positions = await Positions.find({ electionId: election });

    if (!positions) {
      res.status(404);
      throw new Error("candidate not found");
    }

    res.status(200).json(positions);
  } catch (error) {
    res.status(400);
    throw new Error("can not get candidate");
  }
});

/**
 * @Desc    Get a positions by election id
 * @Route   GET /api/v1/positions/:id
 * @Access  Private
 */
const getPosition = asyncHandler(async function (req, res) {
  const { id } = req.params;

  try {
    const position = await Positions.findById(id);

    if (!position) {
      res.status(404);
      throw new Error("candidate not found");
    }

    res.status(200).json(position);
  } catch (error) {
    res.status(400);
    throw new Error("can not get candidate");
  }
});

/**
 * @Desc    Update positions
 * @Route   PUT /api/v1/positions/:id
 * @Access  Private
 */
const updatePositions = asyncHandler(async function (req, res) {
  const { id } = req.params;

  const position = await Positions.findById(id);

  if (!position) {
    res.status(401);
    throw new Error("candidate not found");
  }

  try {
    await Positions.findByIdAndUpdate(id, req.body);
    res.sendStatus(204);
  } catch (error) {
    res.status(400);
    throw new Error("can not get candidate");
  }
});

/**
 * @Desc    Remove positions
 * @Route   DELETE /api/v1/positions/:id
 * @Access  Private
 */

const deletePositions = asyncHandler(async function (req, res) {
  const { id } = req.params;

  try {
    const findPosition = await Positions.findById(id);

    const electionId = findPosition.electionId;
    const findElection = await Elections.findById(electionId);
    const electionPosition = findElection.positions;

    const filteredPositions = electionPosition.filter(
      (positon) => positon.toString() !== id
    );

    await Elections.findByIdAndUpdate(electionId, {
      positions: filteredPositions,
    });
    await Positions.findByIdAndDelete(id);
    await Candidates.deleteMany({ position: id });
    res.sendStatus(204);
  } catch (error) {
    res.status(400);
    throw new Error("can not delete categories");
  }
});

module.exports = {
  addPositions,
  getPositions,
  getPosition,
  updatePositions,
  deletePositions,
};
