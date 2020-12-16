/* eslint-disable no-undef */
const express = require('express');
const mongoose = require('mongoose');
const cardsUserRouter = require('./routes/cards');
const userRouter = require('./routes/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use(express.static('./public'));

app.use('/users', userRouter);
app.use('/cards', cardsUserRouter);

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`Cервер слушает порт ${PORT}`);
});
