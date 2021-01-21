const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { createUser, getUsers, getUserById } = require('../controllers/users');

router.post('/', createUser);

router.get('/', getUsers);

router.get('/:userid', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), getUserById);

module.exports = router;
