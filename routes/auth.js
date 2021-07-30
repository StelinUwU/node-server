const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleSignin } = require("../controllers/auth");
const { validateFields } = require("../middlewares/validate-fields");

const router = Router();
router.post(
  "/login",
  [
    check("email", "The email is not valid").isEmail(),
    check("password", "The password is not valid").not().isEmpty(),
    validateFields,
  ],
  login
);

router.post(
  "/google",
  [check("id_token", "id_token is required").not().isEmpty(), validateFields],
  googleSignin
);

module.exports = router;
