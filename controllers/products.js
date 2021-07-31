const { response } = require("express");

const { Product } = require("../models");

const createProduct = async (req, res = response) => {
  const { state, user, ...body } = req.body;
  const productDB = await Product.findOne({ name: body.name });

  if (productDB) {
    return res
      .status(400)
      .json({ msg: `Product ${productDB.name} already exists` });
  }
  const data = { ...body, name: body.name.toUpperCase(), user: req.user._id };
  const product = await new Product(data);

  //Guardar db
  await product.save();

  res.status(201).json(product);
};

//Obtener categorías - paginado - total - populate
const getProducts = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { state: true };

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate("category", "name")
      .populate("user", "name")
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.json({ total, products });
};

//Obtener categoría - populate {}
const getProduct = async (req, res = response) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate("user", "name")
    .populate("category", "name");

  res.json(product);
};

//Actualizar categoría
const updateProduct = async (req, res = response) => {
  const { id } = req.params;
  const { state, user, ...data } = req.body;

  if (data.name) {
    data.name = data.name.toUpperCase();
  }
  data.user = req.user._id;
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  res.status(400).json(product);
};

//Borrar categoría
const deleteProduct = async (req, res = response) => {
  const { id } = req.params;
  const productDeleted = await Product.findByIdAndUpdate(
    id,
    { state: false },
    { new: true }
  );
  res.status(201).json(productDeleted);
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
