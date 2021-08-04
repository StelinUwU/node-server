const { Router } = require("express");
const { check } = require("express-validator");
const {
  uploadFiles,
  /*   updateImage, */
  showImage,
  updateImageCloudinary,
} = require("../controllers/uploads");
const { validateCollections } = require("../helpers");
const { validateFile, validateFields } = require("../middlewares");

const router = Router();

router.post("/", validateFile, uploadFiles);
router.put(
  "/:collection/:id",
  [
    validateFile,
    check("id", "Invalid id").isMongoId(),
    check("collection").custom((c) =>
      validateCollections(c, ["users", "products"])
    ),
    validateFields,
  ],
  /* updateImage */
  updateImageCloudinary
);

router.get(
  "/:collection/:id",
  [
    check("id", "Invalid id").isMongoId(),
    check("collection").custom((c) =>
      validateCollections(c, ["users", "products"])
    ),
    validateFields,
  ],
  showImage
);

module.exports = router;
