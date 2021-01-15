const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createCard, getCard, deleteCard } = require('../controllers/cards');

router.get('/', getCard);

router.post('/', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().hex().length(24),
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(new RegExp('(^https?://)?(([\\w-]+.)+\\w+)(:[1-9]\\d{1,4})?((/[\\w-]+)+)?((/)|(#))?')).required(),
  }),
}), createCard);

router.delete('/:cardid', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), deleteCard);

module.exports = router;
