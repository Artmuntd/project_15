// eslint-disable-next-line import/no-unresolved
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const NotFoundError = require('../errors/not_found_err');
const ErrRequest = require('../errors/err_request');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        const err = new Error('Данный пользователь уже зарегистрирован в базе');
        err.name = 'UserExist';
        return Promise.reject(err);
      }
      if (req.body.password === null || req.body.password.match(/^ *$/) !== null || req.body.password.length < 8) {
        const err = new Error('Неверно задан пароль');
        err.name = 'PasswordError';
        return Promise.reject(err);
      }
      return (bcrypt.hash(req.body.password, 10));
    })
    .then((password) => {
      const user = User.create({
        name, about, avatar, email, password,
      });
      return user;
    })
    .then(() => User.findOne({ email }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else if (err.name === 'UserExist') {
        res.status(409).send({ message: err.message });
      } else if (err.name === 'PasswordError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Нет пользователя с таким id', err }));
};

module.exports.getUserById = (req, res) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.userid);
  if (!isValid) {
    return Promise.reject(new ErrRequest('Неверный формат'));
  }

  try {
    User.findById(req.params.userid)
      .orFail(new Error('Ошибка на сервере'))
      .then((user) => res.send({ data: user }))
      .catch((err) => new NotFoundError('Нет пользователя с таким id', err));
  } catch (err) {
    res.status(500).send({ message: err.message });
  }

  return null;
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUser(email, password)
    .then((user) => {
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
