const { Router } = require("express");
const { check } = require("express-validator");
const {
  updateCategory,
  createCategory,
  getCategories,
  getCategory,
  deleteCategory,
} = require("../controllers/categories");
const { categoryValidation } = require("../helpers/db-validators");
const { validateFields, validateJWT, isAdmin } = require("../middlewares");

const router = Router();

//Url /api/categories

//Obtener todas las categorias - publico
router.get("/", getCategories);

//Obtener  una categoria por id - publico
//Midleware personalizado para el ID,
router.get(
  "/:id",
  [
    check("id", "Invalid id").isMongoId(),
    check("id").custom(categoryValidation),
    validateFields,
  ],
  getCategory
);

//Crear  una categoria  - privado -cualquier persona con un token valido
router.post(
  "/",
  [validateJWT, check("name", "Name is required").notEmpty(), validateFields],
  createCategory
);
//Actualizar un registro por id - cualquiera con token valido
router.put(
  "/:id",
  [
    validateJWT,
    check("name", "Name is required").notEmpty(),
    check("id").custom(categoryValidation),
    validateFields,
  ],
  updateCategory
);

//Borrar una categoría - admin
router.delete(
  "/:id",
  [
    validateJWT,
    isAdmin,
    check("id", "Invalid id").isMongoId(),
    check("id").custom(categoryValidation),
    validateFields,
  ],
  deleteCategory
);

module.exports = router;
