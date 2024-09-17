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
  const { position, description, electionId } = req.body;

  if (!position || !description) {
    res.status(400);
    throw new Error("fill all required fields");
  }

  const checkTitle = await Positions.findOne({
    position: position,
    electionId: electionId,
  });

  console.log(req.body);

  if (checkTitle) {
    res.status(400);
    throw new Error("title already created");
  }

  const newPosition = await Positions.create({
    positionName: position,
    positionDescription: description,
    electionId: electionId,
  });

  if (newPosition) {
    const election = await Elections.updateOne(
      { _id: electionId },
      {
        $push: { positions: newPosition._id },
      }
    );
    console.log(election);
    res.status(201).json({
      position: newPosition,
    });
  } else {
    res.status(400);
    throw new Error("could not create a new category");
  }
});

/**
 * @Desc    GET all positions
 * @Route   Get /api/v1/positions
 * @Access  Private
 */
const getAllPositions = asyncHandler(async function (req, res) {
  try {
    const allPositions = await Positions.find({
      electionId: req.body.electionId,
    });

    res.status(200).json({
      categories: allPositions,
    });
  } catch (error) {
    res.status(400);
    throw new Error("can not get all candidates");
  }
});

/**
 * @Desc    Get a positions by election id
 * @Route   GET /api/v1/positions/:id
 * @Access  Private
 */
const getPositions = asyncHandler(async function (req, res) {
  const { id } = req.params;

  console.log(id);

  try {
    const position = await Positions.find({ electionId: id });

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
 * @Desc    Get a positions by election id
 * @Route   GET /api/v1/positions/:id
 * @Access  Private
 */
const getPosition = asyncHandler(async function (req, res) {
  const { id } = req.params;

  console.log(id);

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
    // const updatedCategories = await Positions.findById(id);
    await C;
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
const deleteManyPositions = asyncHandler(async function (req, res) {
  const { id } = req.params;

  console.log(id);

  try {
    await Positions.deleteMany({ electionId: id });
    res.sendStatus(204);
  } catch (error) {
    res.status(400);
    throw new Error("can not delete categories");
  }
});

const deletePositions = asyncHandler(async function (req, res) {
  const { id } = req.params;

  const category = await Positions.findById(id);

  if (!category) {
    res.status(401);
    throw new Error("categories not found");
  }

  try {
    await Positions.findByIdAndDelete(id, req.body);
    await Candidates.deleteMany({ position: id });
    res.sendStatus(204);
  } catch (error) {
    res.status(400);
    throw new Error("can not delete categories");
  }
});

module.exports = {
  addPositions,
  getAllPositions,
  getPositions,
  getPosition,
  updatePositions,
  deletePositions,
  deleteManyPositions,
};
