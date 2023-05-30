const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const {
  ConflictError,
  NotFoundError,
  BadRequestError,
} = require('../errors/index');

module.exports.createUser = (req, res, next) => {
  // Создаёт карточку при регистрации

  const { email, password, name } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
      })
        .then((user) => res.status(201).send({ data: user }))
        .catch((err) => {
          if (err.code === 11000) {
            return next(
              new ConflictError('Пользователь c таким email уже существует')
            );
          }
          if (err.name === 'ValidationError') {
            return next(
              new BadRequestError(
                'Переданы некорректные данные при создании пользователя'
              ),
            );
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
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' }
      );
      // вернём токен
      res.cookie('jwt', token, {
        // token - наш JWT токен, который мы отправляем
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.status(200).send({ message: 'Login succesful' });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  // Возвращает информацию о пользователе (email и имя)
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  // Обновляет информацию о пользователе (email и имя)
  const id = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь с указанным _id не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};