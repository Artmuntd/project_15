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
  try {
    const isValid = mongoose.Types.ObjectId.isValid(req.params.cardid);
    if (!isValid) {
      const err = new Error('Неверный формат');
      err.name = 'ParseError';
      throw err;
    }

    Card.findByIdAndRemove(req.params.cardid)
      .then((card) => {
        if (!card) {
          const err = new Error(`Карточка с _id:${req.params.cardid} не найдена в базе данных`);
          err.name = 'NotFoundError';
          throw err;
        }

        return res.send({ message: `Карточка с _id:${req.params.cardid} успешно удалена из базы данных` });
      })
      .catch((err) => {
        if (err.name === 'NotFoundError') {
          return res.status(404).send({ message: err.message });
        }

        return res.status(500).send({ message: err.message });
      });
  } catch (err) {
    if (err.name === 'ParseError') {
      return res.status(400).send({ message: err.message });
    }
    return res.status(500).send({ message: err.message });
  }
  return null;
};

// var e = new Error('Неверные входные данные'); // e.name равно 'Error'
// e.name = 'ParseError';
// throw e;

// .orFail(new Error('Ошибка на сервере'))

module.exports = {
  deleteCard,
  createCard,
  getCard,
};
