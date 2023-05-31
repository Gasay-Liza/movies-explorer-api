const userRouter = require('express').Router();

const {
  getUser,
  updateUser,
} = require('../controllers/users');

userRouter.post('/me', getUser); // возвращает информацию о пользователе (email и имя)

userRouter.patch('/me', updateUser); // обновляет информацию о пользователе (email и имя)

module.exports = { userRouter };
