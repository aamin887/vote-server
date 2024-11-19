// > include custom errors

const verifyRoles = (allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.roles;
    const roles = [...allowedRoles];
    const result = userRoles.map((role) =>
      roles.includes(role).find((rol) => rol === true)
    );
    if (!result) sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
