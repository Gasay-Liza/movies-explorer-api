const mongoose = require('mongoose');
const validator = require('validator');

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
      required: false,
      minlength: 2, // минимальная длина имени — 2 символа
      maxlength: 30, // а максимальная — 30 символов
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('user', userSchema);
