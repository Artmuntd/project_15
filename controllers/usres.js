const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(400).send({ message: err.message }));
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  try {
    User.findById(req.params.userid)
      .orFail(new Error('Данный пользователь отсутсвует в базе'))
      .then((user) => res.send({ data: user }))
      .catch((err) => res.status(404).send({ message: err.message }));
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
