const { response } = require("express");

const isAdmin = (req, res = response, next) => {
  if (!req.user) {
    return res.status(500).json({ msg: "token validation is missing" });
  }
  const { role, name } = req.user;
  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({ msg: `${name} is not admin` });
  }
  next();
};

const hasRole = (...roles) => {
  return (req, res = response, next) => {
    if (!req.user) {
      return res.status(500).json({ msg: "token validation is missing" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(401).json({ msg: `Unauthorized ${req.user.role}` });
    }
    next();
  };
};

module.exports = {
  isAdmin,
  hasRole,
};
