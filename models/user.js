const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { UnauthorizedError } = require('../errors/UnauthorizedError');
const { INCORRECT_USERDATA_MESSAGE } = require('../utils/errors');

const userSchema = new mongoose.Schema(
  {
    email: {
      // почта пользователя, по которой он регистрируется
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (string) => {
          validator.isEmail(string); // валидация email
        },
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },

    name: {
      // имя пользователя
      type: String,
      required: true,
      minlength: 2, // минимальная длина имени — 2 символа
      maxlength: 30, // а максимальная — 30 символов
    },
  },
  {
    versionKey: false,
    toJSON: { useProjection: true },
    toObject: { useProjection: true },
  },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email })
    .select('+password') // this — это модель User
    .then((user) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        return Promise.reject(
          new UnauthorizedError(INCORRECT_USERDATA_MESSAGE),
        );
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError(INCORRECT_USERDATA_MESSAGE),
          );
        }

        return user; // теперь user доступен
      });
    });
};

module.exports = mongoose.model('user', userSchema);
