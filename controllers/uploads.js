const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);
const { response } = require("express");
const { uploadFile } = require("../helpers");
const { User, Product } = require("../models");

const uploadFiles = async (req, res = response || !req.files.file) => {
  try {
    //Imagenes
    const name = await uploadFile(req.files, undefined, "imgs");

    res.json({ name });
  } catch (msg) {
    res.status(400).json({ msg });
  }
};

const updateImage = async (req, res = response) => {
  const { id, collection } = req.params;
  let modelo;
  switch (collection) {
    case "users":
      modelo = await User.findById(id);
      if (!modelo) {
        return res.status(400).json("Invalid id");
      }
      break;
    case "products":
      modelo = await Product.findById(id);
      if (!modelo) {
        return res.status(400).json("Invalid id");
      }
      break;

    default:
      res.status(500).json({ msg: "Oops something went wrong" });
  }
  //Limpiar imagenes previas
  if (modelo.img) {
    //Borrar la imagen del servidor
    const pathImage = path.join(
      __dirname,
      "../uploads",
      collection,
      modelo.img
    );
    if (fs.existsSync(pathImage)) {
      fs.unlinkSync(pathImage);
    }
  }
  const name = await uploadFile(req.files, undefined, collection);
  modelo.img = name;
  await modelo.save();
  res.json({ modelo });
};

const showImage = async (req, res = response) => {
  const { id, collection } = req.params;
  let modelo;
  switch (collection) {
    case "users":
      modelo = await User.findById(id);
      if (!modelo) {
        return res.status(400).json("Invalid id");
      }
      break;
    case "products":
      modelo = await Product.findById(id);
      if (!modelo) {
        return res.status(400).json("Invalid id");
      }
      break;

    default:
      res.status(500).json({ msg: "Oops something went wrong" });
  }
  //Limpiar imagenes previas
  if (modelo.img) {
    //Borrar la imagen del servidor
    const pathImage = path.join(
      __dirname,
      "../uploads",
      collection,
      modelo.img
    );
    if (fs.existsSync(pathImage)) {
      return res.sendFile(pathImage);
    }
  }
  const notImagePath = path.join(__dirname, "../assets/no-image.jpg");
  res.sendFile(notImagePath);
};
const updateImageCloudinary = async (req, res = response) => {
  const { id, collection } = req.params;
  let modelo;
  switch (collection) {
    case "users":
      modelo = await User.findById(id);
      if (!modelo) {
        return res.status(400).json("Invalid id");
      }
      break;
    case "products":
      modelo = await Product.findById(id);
      if (!modelo) {
        return res.status(400).json("Invalid id");
      }
      break;

    default:
      res.status(500).json({ msg: "Oops something went wrong" });
  }
  //Limpiar imagenes previas
  if (modelo.img) {
    //Borrar la imagen del servidor
    const nameArr = modelo.img.split("/");
    const name = nameArr[nameArr.length - 1];
    const [public_id] = name.split(".");

    cloudinary.uploader.destroy(public_id);
  }
  const { tempFilePath } = req.files.file;

  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  modelo.img = secure_url;
  await modelo.save();
  res.json({ modelo });
};

module.exports = {
  uploadFiles,
  updateImage,
  showImage,
  updateImageCloudinary,
};
