const router = require('express').Router();
const fs = require('fs');

router.get('/', (req, res) => {
  fs.readFile('./data/card.json', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Файл не прочитан' });
    }

    return res.send(data.toString());
  });
});

module.exports = router;
