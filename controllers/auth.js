const db = require("../models");
const config = require("../config/auth");
const { user: User, role: Role, refreshToken: RefreshToken } = db;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  // Save User to Database
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 12)
    })

    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles
          }
        }
      });

      await user.setRoles(roles);
      return res.send({ message: "User was registered successfully!" });
    } else {
      // user role = 1(normal user)
      await user.setRoles([1]);
      return res.send({ message: "User was registered successfully!" });
    }
    } catch (err) {
      return res.status(500).send({ message: err });
    };
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username
      } 
    });
    
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    let passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration // 24 hours
    });

    const refreshToken = await RefreshToken.createToken(user);

    const authorities = [];
    let roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    return res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
      refreshToken: refreshToken
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).send({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

    if (!refreshToken) {
      res.status(403).send({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });
      
      res.status(403).send({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).send({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};