const express = require('express');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const limiter = require('./middlewares/limiter');
const cors = require('./middlewares/cors');
const handlerError = require('./middlewares/handlerError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

require('dotenv').config();

// импорт роутеров
const { router } = require('./routes/index');

// подключение к базе mongoose с фильмами
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

const { PORT = 3005 } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger); // подключаем логгер запросов

// Миддлвэры для безопасности
app.use(helmet()); // Настройка заголовков ответа
app.use(limiter); // Защита от множества автоматических запросов
app.use(cors);

app.use(router);

app.use(errorLogger); // подключаем логгер ошибок

router.use(errors());

// централизованный обработчик ошибок
router.use((err, req, res, next) => {
  handlerError({
    err,
    req,
    res,
    next,
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});
