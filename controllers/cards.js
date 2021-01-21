// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../errors/not_found_err');
const Prohibition = require('../errors/prohibition_err');

const getCard = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link, _id } = req.body;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardid)
    .orFail(() => new NotFoundError(`Карточка с _id:${req.params.cardid} не найдена в базе данных`))
    .then((card) => {
      const { owner } = card;
      if (req.user._id === owner.toString()) {
        return Card.findByIdAndRemove(req.params.cardid);
      }
      return Promise.reject(new Prohibition('нет доступа для удаления карточки'));
    })
    .then(() => res.status(200).send({ message: `Карточка с _id:${req.params.cardid} успешно удалена из базы данных` }))
    .catch(next);
};

module.exports = {
  deleteCard,
  createCard,
  getCard,
};
