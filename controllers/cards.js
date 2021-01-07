// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');
const Card = require('../models/card');

const getCard = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', err }));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err) {
        return res.status(400).send({ message: 'Произошла ошибка', err });
      }
      return next(err);
    });
};

const deleteCard = (req, res) => {
  Card.findById(req.params.cardid)
    .then((card) => {
      if (!card) {
        return Promise.reject(new Error(`Карточка с _id:${req.params.cardid} не найдена в базе данных`));
      }
      const { owner } = card;
      return owner;
    })
    .then((owner) => {
      if (req.user._id === owner.toString()) {
        return Card.findByIdAndRemove(req.params.cardid);
      }
      return Promise.reject(new Error('нет доступа для удаления карточки'));
    })
    .then(() => res.status(200).send({ message: `Карточка с _id:${req.params.cardid} успешно удалена из базы данных` }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports = {
  deleteCard,
  createCard,
  getCard,
};
