const router = require('express').Router();
const { movieRouter } = require('./movies'); // роут фильмов
const { userRouter } = require('./users'); // роут юзера

const auth = require('../middlewares/auth'); // мидлврэр авторизации

const { NotFoundError } = require('../errors/index'); // импорт кастомного класса ошибки

const { createUser, login, signout } = require('../controllers/users'); // импорт контроллера
const {
  registerValidator,
  loginValidator,
} = require('../middlewares/validations'); // импорт валидации регистрации и авторизации

router.post('/signup', registerValidator, createUser);

router.post('/signin', loginValidator, login);

router.post('/signout', signout);

router.use(auth);

router.use('/movies', movieRouter);
router.use('/users', userRouter);

router.use('*', () => {
  throw new NotFoundError('Маршрут не найден');
});

module.exports = {
  router,
};
