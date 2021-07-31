const { response } = require("express");

const { Category } = require("../models");

const createCategory = async (req, res = response) => {
  const name = req.body.name.toUpperCase();
  const categoryDB = await Category.findOne({ name });

  if (categoryDB) {
    return res
      .status(400)
      .json({ msg: `Category ${categoryDB.name} already exists` });
  }
  const data = { name, user: req.user._id };
  const category = await new Category(data);

  //Guardar db
  await category.save();

  res.status(201).json(category);
};

//Obtener categorías - paginado - total - populate
const getCategories = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { state: true };

  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .populate("user", "name")
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.json({ total, categories });
};

//Obtener categoría - populate {}
const getCategory = async (req, res = response) => {
  const { id } = req.params;
  const category = await Category.findById(id).populate("user", "name");

  res.json(category);
};

//Actualizar categoría
const updateCategory = async (req, res = response) => {
  const { id } = req.params;
  console.log(id);
  const { state, user, ...data } = req.body;
  data.name = data.name.toUpperCase();
  data.user = req.user._id;
  const category = await Category.findByIdAndUpdate(id, data, { new: true });
  res.status(400).json(category);
};

//Borrar categoría
const deleteCategory = async (req, res = response) => {
  const { id } = req.params;
  const categoryDeleted = await Category.findByIdAndUpdate(
    id,
    { state: false },
    { new: true }
  );
  res.status(201).json(categoryDeleted);
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
