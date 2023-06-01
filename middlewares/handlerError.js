const {
  INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_MESSAGE,
} = require('../utils/errors');

const handlerErrors = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message:
      statusCode === INTERNAL_SERVER_ERROR
        ? INTERNAL_SERVER_ERROR_MESSAGE
        : message,
  });
  next();
};

module.exports = handlerErrors;
