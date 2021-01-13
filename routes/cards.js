const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createCard, getCard, deleteCard } = require('../controllers/cards');

router.get('/', getCard);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
}), createCard);
router.delete('/:cardid', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

module.exports = router;
