const router = require('express').Router();
const userController = require('../Controller/userController');

router.post(process.env.USER_SIGNUP, userController.signUp);
router.post(
  process.env.USER_LOGIN,
  userController.login,
  userController.getUser
);
router.get(process.env.USER_GET_USERS, userController.getUsers);
router.get(process.env.USER_GET_USER, userController.getUser);

module.exports = router;
