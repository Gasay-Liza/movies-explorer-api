const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { movieRouter } = require('./movies');
const { userRouter } = require('./users');
const auth = require('../middlewares/auth');
const { linkRegex } = require('../utils/constans');
const { NotFoundError } = require('../errors/index');
const { createUser, login } = require('../controllers/users');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createUser
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login
);

router.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

router.use(auth);

router.use('/movies', movieRouter);
router.use('/users', userRouter);

router.use('*', () => {
  throw new NotFoundError('Маршрут не найден');
});

module.exports = {
  router,
};
