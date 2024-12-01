// > include custom errors
const { UnauthorizedError } = require("../helpers/CustomError.lib");
const roless = require("../config/roles.json");

const verifyRoles = (allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.roles;
    const roles = [...allowedRoles];
    console.log(roles, "sss>>>");
    const result = userRoles.map((role) =>
      roles.includes(role).find((rol) => rol === true)
    );

    if (!result) throw new UnauthorizedError();
    next();
  };
};

module.exports = verifyRoles;
