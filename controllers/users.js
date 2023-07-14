const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const User = require('../models/user');
const {
  ConflictError,
  NotFoundError,
  BadRequestError,
} = require('../errors/index');

const {
  AUTHORIZATION_NOT_FOUND_USER_ERROR_MESSAGE,
  SUCCESS_STATUS_OK,
  SUCCESS_STATUS_CREATED,
  DUPLICATION_ERROR,
  USER_BAD_REQUEST_ERROR_MESSAGE,
  REGISTER_EMAIL_DUPLICATION_ERROR_MESSAGE,
  USER_DUPLICATION_ERROR_MESSAGE,
  REGISTER_BAD_REQUEST_ERROR_MESSAGE,
  USER_NOT_FOUND_ERROR_MESSAGE,
  SUCCESSFUL_LOGIN_MESSAGE,
  SUCCESSFUL_LOGOUT_MESSAGE,
} = require('../utils/errors');

module.exports.createUser = (req, res, next) => {
  // Создаёт юзера при регистрации
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
      })
        .then((user) => res.status(SUCCESS_STATUS_CREATED).send(user))
        .catch((err) => {
          if (err.code === DUPLICATION_ERROR) {
            return next(new ConflictError(REGISTER_EMAIL_DUPLICATION_ERROR_MESSAGE));
          }
          if (err.name === 'ValidationError') {
            return next(new BadRequestError(REGISTER_BAD_REQUEST_ERROR_MESSAGE));
          }
          return next(err);
        });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  // Авторизация пользователя
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      // вернём токен
      res.cookie('jwt', token, {
        // token - наш JWT токен, который мы отправляем
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res
        .status(SUCCESS_STATUS_CREATED)
        .send({ message: SUCCESSFUL_LOGIN_MESSAGE });
    })
    .catch(next);
};

module.exports.signout = (req, res) => {
  // Выход из аккаунта
  res.clearCookie('jwt').send({ message: SUCCESSFUL_LOGOUT_MESSAGE });
};

module.exports.getUser = (req, res, next) => {
  // Возвращает информацию о пользователе (email и имя)
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(AUTHORIZATION_NOT_FOUND_USER_ERROR_MESSAGE);
    })
    .then((user) => res.status(SUCCESS_STATUS_OK).send(user))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  // Обновляет информацию о пользователе (email и имя)
  const id = req.user._id;
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    id,
    { name, email },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(() => {
      throw new NotFoundError(USER_NOT_FOUND_ERROR_MESSAGE);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(USER_BAD_REQUEST_ERROR_MESSAGE));
      }
      if (err.code === DUPLICATION_ERROR) {
        return next(new ConflictError(USER_DUPLICATION_ERROR_MESSAGE));
      }
      return next(err);
    });
};
