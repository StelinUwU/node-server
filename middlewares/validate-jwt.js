const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({ msg: "Token not found" });
  }
  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    req.uid = uid;
    //Leer el usuario que corresponde al uid almacenar en la req.user
    const user = await User.findById(uid);

    //Verificar que exista el usuario
    if (!user) {
      res.status(401).json({ msg: "Invalid token - User not found " });
    }

    //Verificar que el uid tenga el estado en true

    if (!user.state) {
      res.status(401).json({ msg: "Invalid token - user deleted" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = { validateJWT };
