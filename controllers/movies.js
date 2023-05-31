const Movie = require('../models/movie');
const {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} = require('../errors/index');

module.exports.getMovies = (req, res, next) => {
  // Возвращает все сохранённые текущим  пользователем фильмы
  Movie.find({ owner: req.user._id })
    .populate(['owner'])
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  // Cоздаёт фильм

  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    trailerLink,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    trailerLink,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => movie.populate("owner"))
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Невалидные данные"));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  // Удаляет фильм

  Movie.findById(req.params.movieId) // находим карточку по id
    .orFail(new NotFoundError('Фильм c указанным _id не найден.')) // если не удалось найти по id
    .then((data) => {
      if (!(req.user._id === data.owner.toString())) {
        // проверяем можем ли мы ее удалить (владелец фильма и юзер один и тот же?)
        return next(new ForbiddenError('Нельзя удалить чужой фильм'));
      }
      return Movie.findByIdAndRemove(req.params.movieId) // находим карточку по id и удаляем
        .orFail(() => new NotFoundError('Фильм c указанным _id не найден'))
        .then((movie) => {
          res.send(movie);
        })
        .catch(next);
    })
    .catch(next);
};
