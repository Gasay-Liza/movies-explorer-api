const movieRouter = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  createMovieValidator,
  movieIdValidator,
} = require('../middlewares/validations'); // импорт валидации

movieRouter.get('/', getMovies); // возвращает все сохранённые текущим  пользователем фильмы

movieRouter.post('/', createMovieValidator, createMovie); // создаёт фильм с переданными в теле country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId

movieRouter.delete('/:movieId', movieIdValidator, deleteMovie); // создаёт фильм с переданными в теле country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId

module.exports = { movieRouter };
