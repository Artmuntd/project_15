const express = require('express');
const cardsUserRouter = require('./routes/cards');
const userRouter = require('./routes/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.static('./public'));

app.use('/users', userRouter);
app.use('/cards', cardsUserRouter);

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`Cервер слушает порт ${PORT}`);
});
