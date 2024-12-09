const { InternalServerError } = require("../helpers/CustomError.lib");
const asyncHandler = require("express-async-handler");

function paginatedRoute(model) {
  return asyncHandler(async function (req, res, next) {
    const creator = req.user._id;
    console.log(creator);
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < (await model.countDocuments({ creator }).exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    results.results = await model
      .find({ creator })
      .limit(limit)
      .skip(startIndex)
      .exec();

    res.paginatedResults = results;
    next();
  });
}

module.exports = paginatedRoute;
