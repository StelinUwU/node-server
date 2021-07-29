const { response } = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const { generateJWT } = require("../helpers/generate-jwt");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    //Verificar si el email existe
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid data - email" });
    }
    //Verificar si el usuario está activo
    if (!user.state) {
      return res.status(400).json({ msg: "Invalid data - state" });
    }
    //Verificar contraseña
    const validPasword = bcryptjs.compareSync(password, user.password);
    if (!validPasword) {
      return res.status(400).json({ msg: "Invalid data - password" });
    }
    //Generar el jwt

    const token = await generateJWT(user.id);

    res.json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Oops something went wrong " });
  }
};

module.exports = {
  login,
};
