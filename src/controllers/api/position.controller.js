const asyncHandler = require("express-async-handler");

const {
  createNewPosition,
  getAllPositions,
  getPositionById,
  updatePositionById,
  deleteAPosition,
} = require("../../services/api/position.service");
const {
  BadRequestError,
  InternalServerError,
} = require("../../helpers/CustomError.lib");

/**
 * @Desc    Add positions
 * @Route   POST /api/v1/positions
 * @Access  Private
 */
const addPosition = asyncHandler(async function (req, res) {
  const { position, description, election } = req.body;
  if (!position || !description || !election) {
    throw new BadRequestError();
  }
  const formData = {
    position,
    description,
    election,
  };
  const newPosition = await createNewPosition(formData);
  if (newPosition) return res.status(201).json(newPosition);
  throw new InternalServerError();
});

/**
 * @Desc    Get all positions
 * @Route   GET /api/v1/positions/:id
 * @Access  Private
 */
const getPositions = asyncHandler(async function (req, res) {
  const { election } = req.query;
  const positions = await getAllPositions(election);
  if (positions) return res.status(200).json(positions);
  throw new InternalServerError();
});

/**
 * @Desc    Get a positions by election id
 * @Route   GET /api/v1/positions/:id
 * @Access  Private
 */
const getPosition = asyncHandler(async function (req, res) {
  const { id } = req.params;
  const position = await getPositionById(id);
  if (position) return res.status(200).json(position);
  throw new InternalServerError();
});

/**
 * @Desc    Update positions
 * @Route   PUT /api/v1/positions/:id
 * @Access  Private
 */
const updatePositions = asyncHandler(async function (req, res) {
  const { id } = req.params;
  const { election } = req.query;
  const updatedPosition = await updatePositionById({
    id,
    election,
    formData: req.body,
  });
  if (updatedPosition) return res.status(201).json(updatedPosition);
  throw new InternalServerError();
});

/**
 * @Desc    Remove positions
 * @Route   DELETE /api/v1/positions/:id
 * @Access  Private
 */
const deletePositions = asyncHandler(async function (req, res) {
  const { id } = req.params;
  const { election } = req.query;
  if (await deleteAPosition({ id, election })) return res.sendStatus(204);
  throw new InternalServerError();
});

module.exports = {
  addPosition,
  getPositions,
  getPosition,
  updatePositions,
  deletePositions,
};
