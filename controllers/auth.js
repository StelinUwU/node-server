const { response } = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const { generateJWT } = require("../helpers/generate-jwt");
const { googleValidation } = require("../helpers/google-validation");

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

const googleSignin = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { email, name, img } = await googleValidation(id_token);
    let user = await User.findOne({ email });
    if (!user) {
      //Tenemos que crearlo
      const data = { name, email, password: ":p", img, google: true };
      user = new User(data);
      await user.save();
    }

    //Si el usuario en DB  tiene el estado en false
    if (!user.state) {
      res.status(401).json({ msg: "User deleted" });
    }
    //Generar el jwt
    const token = await generateJWT(user.id);

    res.json({ msg: "Todo ok! google signin", user, token });
  } catch (error) {
    res.status(400).json({ msg: "Token is not valid" });
  }
};
module.exports = {
  login,
  googleSignin,
};
