const asyncHandler = require("express-async-handler");
const Positions = require("../model/position.model");

/**
 * @Desc    Add positions
 * @Route   POST /api/v1/positions
 * @Access  Private
 */
const addPositions = asyncHandler(async function (req, res) {
  const { title, description } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error("fill all required fields");
  }

  const checkTitle = await Positions.findOne({ title });

  if (checkTitle) {
    res.status(400);
    throw new Error("title already created");
  }

  const newPosition = await Positions.create({
    title,
    description,
  });

  if (newPosition) {
    res.status(201).json({
      category: newPosition,
    });
  } else {
    res.status(400);
    throw new Error("could not create a new category");
  }
});

/**
 * @Desc    GET positions
 * @Route   Get /api/v1/positions
 * @Access  Private
 */
const getAllPositions = asyncHandler(async function (req, res) {
  try {
    const allPositions = await Positions.find();

    res.status(200).json({
      categories: allPositions,
    });
  } catch (error) {
    res.status(400);
    throw new Error("can not get all candidates");
  }
});

/**
 * @Desc    Get a positions
 * @Route   GET /api/v1/positions/:id
 * @Access  Private
 */
const getPositions = asyncHandler(async function (req, res) {
  const { id } = req.params;

  try {
    const position = await Positions.findById(id);

    if (!position) {
      res.status(400);
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
    res.status(400);
    throw new Error("candidate not found");
  }

  try {
    await Positions.findByIdAndUpdate(id, req.body);
    const updatedCategories = await Positions.findById(id);
    res.status(200).json(updatedCategories);
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

  const category = await Positions.findById(id);

  if (!category) {
    res.status(400);
    throw new Error("categories not found");
  }

  try {
    await Positions.findByIdAndDelete(id, req.body);
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
  updatePositions,
  deletePositions,
};
