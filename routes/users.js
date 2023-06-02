const userRouter = require('express').Router();

const { getUser, updateUser } = require('../controllers/users');

const { userValidator } = require('../middlewares/validations');

userRouter.get('/me', getUser); // возвращает информацию о пользователе (email и имя)

userRouter.patch('/me', userValidator, updateUser); // обновляет информацию о пользователе (email и имя)

module.exports = { userRouter };
