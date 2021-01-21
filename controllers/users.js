// eslint-disable-next-line import/no-unresolved
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const NotFoundError = require('../errors/not_found_err');
const ErrRequest = require('../errors/err_request');
const UserExistError = require('../errors/user_exist_err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.userid);
  if (!isValid) {
    return Promise.reject(new ErrRequest('Неверный формат'));
  }

  User.findById(req.params.userid)
    .orFail(() => new NotFoundError('Нет пользователя с таким id'))
    .then((user) => res.send({ data: user }))
    .catch(next);

  return null;
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return Promise.reject(new UserExistError('Данный пользователь уже зарегистрирован в базе'));
      }
      if (req.body.password === null || req.body.password.match(/^ *$/) !== null || req.body.password.length < 8) {
        return Promise.reject(new ErrRequest('Неверно задан пароль'));
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
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUser(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      return (res.send({ token })
                || res.cookie('jwt', token, {
                  maxAge: 3600000 * 24 * 7,
                  httpOnly: true,
                }));
    })
    .catch(next);
};
