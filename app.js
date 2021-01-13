const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().uri(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(errorLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'ресурс не найден' });
});
const catchErrorMIddleware = ((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    console.error(err);
    return res.status(err.status).send({ status: err.status, message: err.message });
  }
  // if (err.status(500)) {
  //     return res.status(500).send({ message: err.message });
  // }
  return next();
});

app.use(catchErrorMIddleware);
app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500)
    .send({ status: err.status, message: err.message });
});

app.listen(PORT, () => {
  console.log(` Сервер слушает ${PORT}`);
});
