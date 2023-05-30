const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
// const { UnauthorizedError } = require('../errors/index');

const movieSchema = new mongoose.Schema(
  {
    country: {
      // страна создания фильма
      type: String,
      required: true,
    },

    director: {
      // режиссёр фильма.
      type: String,
      required: true,
    },

    duration: {
      // длительность фильма
      type: Number,
      required: true,
    },

    year: {
      // год выпуска фильма
      type: Number,
      required: true,
    },

    description: {
      // описание фильма
      type: String,
      required: true,
    },

    image: {
      // ссылка на постер к фильму
      type: String,
      required: true,
      validate: {
        validator: (string) => {
          validator.isURL(string);
        },
      },
    },

    trailerLink: {
      // ссылка на трейлер фильма
      type: String,
      required: true,
      validate: {
        validator: (string) => {
          validator.isURL(string);
        },
      },
    },

    thumbnail: {
      // миниатюрное изображение постера к фильму
      type: String,
      required: true,
      validate: {
        validator: (string) => {
          validator.isURL(string);
        },
      },
    },

    owner: {
      // id пользователя, который сохранил фильм
      type: mongoose.Schema.Types.ObjectId, // тип - id
      required: true,
    },

    movieId: {
      // id фильма, который содержится в ответе сервиса MoviesExplorer
      type: Number,
      required: true,
    },

    nameRU: {
      // название фильма на русском языке
      type: String,
      required: true,
    },

    nameEN: {
      // название фильма на английском языке
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('movie', movieSchema);
