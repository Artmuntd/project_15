// eslint-disable-next-line import/no-unresolved
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;
  console.log(req.body);
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))

    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: err.message }));
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Нет пользователя с таким id', err }));
};

module.exports.getUserById = (req, res) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.userid);
  if (!isValid) {
    return res.status(400).send({ message: 'Неверный формат' });
  }

  try {
    User.findById(req.params.userid)
      .orFail(new Error('Ошибка на сервере'))
      .then((user) => res.send({ data: user }))
      .catch((err) => res.status(404).send({ message: 'Нет пользователя с таким id', err }));
  } catch (err) {
    res.status(500).send({ message: err.message });
  }

  return null;
};
module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUser(email, password)
    .then((user) => {
      // const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
