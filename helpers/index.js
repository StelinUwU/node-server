const dbValidators = require("./db-validators");
const generateJWT = require("./generate-jwt");
const googleValidation = require("./google-validation");
const uploadFile = require("./upload-file");

module.exports = {
  ...dbValidators,
  ...generateJWT,
  ...googleValidation,
  ...uploadFile,
};
