const { Router } = require("express");
const { check } = require("express-validator");
const {
  updateProduct,
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
} = require("../controllers/products");
const {
  productValidation,
  categoryValidation,
} = require("../helpers/db-validators");
const { validateFields, validateJWT, isAdmin } = require("../middlewares");

const router = Router();

//Url /api/Products

//Obtener todas las categorias - publico
router.get("/", getProducts);

//Obtener  una categoria por id - publico
//Midleware personalizado para el ID,
router.get(
  "/:id",
  [
    check("id", "Invalid id").isMongoId(),
    check("id").custom(productValidation),
    validateFields,
  ],
  getProduct
);

//Crear  una categoria  - privado -cualquier persona con un token valido
router.post(
  "/",
  [
    validateJWT,
    check("name", "Name is required").notEmpty(),
    check("category", "Invalid category").isMongoId(),
    check("category").custom(categoryValidation),
    validateFields,
  ],
  createProduct
);
//Actualizar un registro por id - cualquiera con token valido
router.put(
  "/:id",
  [
    validateJWT,
    /*     check("category", "Invalid category").isMongoId(), */
    check("id").custom(productValidation),
    validateFields,
  ],
  updateProduct
);

//Borrar una categoría - admin
router.delete(
  "/:id",
  [
    validateJWT,
    isAdmin,
    check("id", "Invalid id").isMongoId(),
    check("id").custom(productValidation),
    validateFields,
  ],
  deleteProduct
);

module.exports = router;
