/* eslint-disable import/no-unresolved */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const AuthError = require('../errors/auth_err');

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  about: {
    type: String,
    required: true,
    minlength: [2, 'минимальная длина имени 2 символа'],
    maxlength: [30, 'максимальная длина имени 30 символов'],
  },

  avatar: {
    type: String,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
      message: (url) => `${url.value} некорректный адрес!`,
    },
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: (email) => `${email.value} некорректный адрес почты!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },

});

userSchema.statics.findUser = function finder(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('User', userSchema);
