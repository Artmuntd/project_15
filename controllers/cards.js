const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const likes = [];
  Card.create({
    name, link, owner: req.user._id, likes,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: err.message }));
};
module.exports.getCard = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deletedCard = (req, res) => {
  Card.findById(req.params.cardid)
    .orFail(new Error('Карточки нет в базе'))
    .then((cardid) => {
      cardid.remove();
      return res.send({ data: cardid });
    })
    .catch((err) => res.status(404).send({ message: err.message }));
};
