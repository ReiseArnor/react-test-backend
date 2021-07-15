const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  const username = await User.findOne({
    where: {
      username: req.body.username
    }
  });
  if (username) {
    return res.status(400).send({
      message: "Failed! Username is already in use!"
    });
  }

  const email = await User.findOne({
    where: {
      email: req.body.email
    }
  });
  if (email) {
    return res.status(400).send({
      message: "Failed! Email is already in use!"
    });
  }

  return next();
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i]
        });
      }
    }
  }
  
  return next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;