const movieRouter = require("express").Router();

const {
  getMovies,
  createMovie,

} = require("../controllers/movies");

movieRouter.get("/", getMovies); // возвращает все сохранённые текущим  пользователем фильмы

movieRouter.post("/", createMovie); // создаёт фильм с переданными в теле country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId

movieRouter.delete("/:movieId", deleteMovie); // создаёт фильм с переданными в теле country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId

module.exports = { movieRouter };