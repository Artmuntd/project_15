const router = require('express').Router();
const fs = require('fs');

router.get('/', (req, res) => {
  fs.readFile('./data/user.json', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Файл не прочитан' });
    }
    return res.send(data.toString());
  });
});

router.get('/:id', (req, res) => {
  fs.readFile('./data/user.json', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Файл не прочитан' });
    }

    const users = JSON.parse(data);
    const user = users.find((u) => u._id === req.params.id);
    if (user) {
      return res.send(user);
    }

    return res.status(404).json({ message: 'Нет пользователя с таким id' });
  });
});

module.exports = router;
