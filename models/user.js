const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator: (value) => validator.isAlpha(value),
      message: 'Некорректное имя',
    },
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'Невалидная ссылка на аватар',
    },
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator(v) {
        return /[A-Za-z0-9]+@[A-Za-z0-9]+\.[a-z]{2,}/.test(v);
      },
      message: (props) => `${props.value} некорректный адрес электронной почты!`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
