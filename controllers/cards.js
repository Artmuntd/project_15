const Card = require('../models/card');

const getCard = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', err }));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  console.log(req.user._id);
  console.log(req.body);
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err) {
        res.status(500).send({ message: 'Произошла ошибка', err });
      }
      next(err);
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (card) {
        res.send({ message: `Карточка с _id:${req.params.id} успешно удалена из базы данных` });
      }
      return res.status(404).send({ message: `Карточка с _id:${req.params.id} не найдена в базе данных` });
    })
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', err }));
};
module.exports = {
  deleteCard,
  createCard,
  getCard,
};
