const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleSignin, validateToken } = require("../controllers/auth");
const { validateFields, validateJWT } = require("../middlewares");

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

router.get("/", [validateJWT], validateToken);
module.exports = router;
