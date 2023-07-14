const express = require('express');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const limiter = require('./middlewares/limiter');
const cors = require('./middlewares/cors');
const handlerError = require('./middlewares/handlerError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MONGO_URL } = require('./utils/config');

const app = express();

// импорт роутеров
const { router } = require('./routes/index');

const { PORT = 3003 } = process.env;

// подключение к базе mongoose с фильмами
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

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
router.use(handlerError);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});
