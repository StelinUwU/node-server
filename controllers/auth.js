const { response } = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-validation");

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
    return res.status(500).json({ msg: "Oops something went wrong " });
  }
};

const googleSignin = async (req, res = response) => {
  const { id_token } = req.body;
  try {
    const { email, name, picture } = await googleVerify(id_token);
    let user = await User.findOne({ email });
    if (!user) {
      const data = {
        name,
        email,
        password: ":P",
        picture,
        google: true,
      };
      console.log(data);
      user = new User(data);
      await user.save();
    }
    if (!user.state) {
      return res.status(401).json({
        msg: "User deleted",
      });
    }
    const token = await generateJWT(user.id);
    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ ok: false, msg: "Invalid data - id_token" });
  }
};

const validateToken = async (req, res = response) => {
  const user = req.user;
  const token = await generateJWT(user.id);
  res.json({ user, token });
};

module.exports = {
  login,
  googleSignin,
  validateToken,
};
