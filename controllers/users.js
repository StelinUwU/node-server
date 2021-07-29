const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");

const usersGet = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { state: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(from)).limit(Number(limit)),
  ]);
  res.json({ total, users });
};

const usersPost = async (req, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  //Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);
  //Guardar en dv

  await user.save();
  res.status(201).json({ msg: "post API - controller", user });
};

const usersPut = async (req, res) => {
  const { id } = req.params;
  const { _id, password, google, email, ...info } = req.body;
  //Validar contra base de datos
  if (password) {
    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    info.password = bcryptjs.hashSync(password, salt);
  }
  const user = await User.findByIdAndUpdate(id, info);
  res.status(400).json(user);
};

const usersDelete = async (req, res = response) => {
  const { id } = req.params;
  const authUser = req.user;
  //Borrar fisicamente
  const user = await User.findByIdAndUpdate(id, { state: false });
  //const usuarioAutenticado, usuarioaBorrar
  res.json({ user });
};
const userPatch = (req, res) => {
  res.json({ msg: "path API -controller" });
};
module.exports = {
  usersGet,
  usersPost,
  usersDelete,
  usersPut,
  userPatch,
};
