const Role = require("../models/role");
const User = require("../models/user");
const isValidRol = async (role = "") => {
  const roleExist = await Role.findOne({ role });
  if (!roleExist) {
    throw new Error(`Role ${role} is not valid`);
  }
};

const emailValidation = async (email = "") => {
  //Verificar si el correo existe
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    throw new Error("The email is already registered");
  }
};

const userByIDValidation = async (id) => {
  //Verificar si el correo existe
  const userExist = await User.findById(id);
  if (!userExist) {
    throw new Error("The id does not exist");
  }
};

module.exports = { isValidRol, emailValidation, userByIDValidation };
