const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const {
  UnauthorizedError,
} = require('../errors/index');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const token = req.cookies.jwt;

  if (!token) {
    return next(
      new UnauthorizedError('Необходима авторизация'),
    );
  }
  // извлечём токен

  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // отправим ошибку, если не получилось
    return next(
      new UnauthorizedError('Необходима авторизация'),
    );
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
