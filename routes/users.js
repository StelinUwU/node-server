const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const {
  usersGet,
  usersPost,
  usersDelete,
  usersPut,
  userPatch,
} = require("../controllers/users");
const {
  isValidRol,
  emailValidation,
  userByIDValidation,
} = require("../helpers/db-validators");

const router = Router();
router.get("/", usersGet);

router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId().bail(),
    check("id").custom(userByIDValidation),
    check("role").custom(isValidRol),
    validateFields,
  ],
  usersPut
);

router.post(
  "/",
  [
    check("email", "The email is not valid").isEmail(),
    check("email").custom(emailValidation),
    check("name", "The name is required").not().isEmpty(),
    check("password", "Invalid password").isLength({ min: 6 }),
    check("role").custom(isValidRol),
    validateFields,
  ],
  usersPost
);

router.delete(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId().bail(),
    check("id").custom(userByIDValidation),
    validateFields,
  ],
  usersDelete
);

router.patch("/", userPatch);

module.exports = router;
