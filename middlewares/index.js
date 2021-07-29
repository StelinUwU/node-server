const validatesFields = require("../middlewares/validate-fields");
const validatesJWT = require("../middlewares/validate-jwt");
const validatesRoles = require("../middlewares/validate-role");

module.exports = {
  ...validatesFields,
  ...validatesJWT,
  ...validatesRoles,
};
