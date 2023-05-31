const Movie = require('../models/movie');
const {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} = require('../errors/index');

module.exports.getMovies = (req, res, next) => {
  // Возвращает все сохранённые текущим  пользователем фильмы
  Movie.find({ owner: userId })
    .populate(['owner'])
    .then((cards) => res.send(cards))
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
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => movie.populate('owner'))
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  // Удаляет фильм

  Movie.findById(req.params.cardId) // находим карточку по id
    .orFail(new NotFoundError('Фильм c указанным _id не найден.')) // если не удалось найти по id
    .then((data) => {
      if (!(req.user._id === data.owner.toString())) {
        // проверяем можем ли мы ее удалить (владелец фильма и юзер один и тот же?)
        throw new ForbiddenError('Недостаточно прав для удаления фильма');
      }
      return Movie.findByIdAndRemove(req.params.cardId) // находим карточку по id и удаляем
        .orFail(() => {
          throw new NotFoundError('Фильм c указанным _id не найден');
        })
        .then((card) => {
          res.send(card);
        })
        .catch(next);
    })
    .catch(next);
};
