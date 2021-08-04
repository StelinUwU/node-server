const validatesFields = require("../middlewares/validate-fields");
const validatesJWT = require("../middlewares/validate-jwt");
const validatesRoles = require("../middlewares/validate-role");
const validateFile = require("./validate-file");
module.exports = {
  ...validatesFields,
  ...validatesJWT,
  ...validatesRoles,
  ...validateFile,
};
