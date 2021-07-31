const { response } = require("express");
const { Collection } = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const { User, Category, Product } = require("../models");

const collectionsAllowed = ["users", "categories", "products", "roles"];

const searchUsers = async (search = "", res = response) => {
  const isMongoID = ObjectId.isValid(search);

  if (isMongoID) {
    const user = await User.findById(search);
    return res.json({ results: user ? [user] : [] });
  }
  const regex = new RegExp(search, "i");
  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ state: true }],
  });
  res.json({ results: users });
};
const searchCategories = async (search = "", res = response) => {
  const isMongoID = ObjectId.isValid(search);

  if (isMongoID) {
    const category = await Category.findById(search);
    return res.json({ results: category ? [category] : [] });
  }
  const regex = new RegExp(search, "i");
  const categories = await Category.find({ name: regex, state: true });
  res.json({ results: categories });
};
const searchProducts = async (search = "", res = response) => {
  const isMongoID = ObjectId.isValid(search);

  if (isMongoID) {
    const product = await Product.findById(search)
      .populate("category", "name")
      .populate("user", "name");
    return res.json({ results: product ? [product] : [] });
  }
  const regex = new RegExp(search, "i");
  const products = await Product.find({ name: regex, state: true })
    .populate("category", "name")
    .populate("user", "name");
  res.json({ results: products });
};

const search = (req, res = response) => {
  const { collection, search } = req.params;
  if (!collectionsAllowed.includes(collection)) {
    return res
      .status(400)
      .json({ msg: `Collections allowed ${collectionsAllowed}` });
  }
  switch (collection) {
    case "users":
      searchUsers(search, res);
      break;
    case "categories":
      searchCategories(search, res);
      break;
    case "products":
      searchProducts(search, res);
      break;

    default:
      res.status(500).json({ msg: "Ooops Something went wrong" });
      break;
  }
};

module.exports = {
  search,
};
