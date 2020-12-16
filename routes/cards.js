const router = require('express').Router();
const { createCard, getCard, deleteCard } = require('../controllers/cards');

router.get('/', getCard);
router.post('/', createCard);
router.delete('/:cardid', deleteCard);

module.exports = router;
