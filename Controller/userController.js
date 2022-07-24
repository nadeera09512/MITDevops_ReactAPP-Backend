const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};
const validatePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

exports.signUp = async (req, res, next) => {
  try {
    const { userName, password, role } = req.body;

    const user = await User.findOne({ userName });
    if (user) {
      return next(new Error('User already exists'));
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      userName,
      password: hashedPassword,
      role: role || 'viewer',
    });
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '5m',
      }
    );

    newUser.accessToken = accessToken;
    await newUser.save();
    res.json({
      data: newUser,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
      return next(new Error('Email does not exist'));
    }
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) {
      res.status(400).send(null);
    }
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1m',
    });
    await User.findByIdAndUpdate(user._id, { accessToken });
    // res.status(200).json({
    //   data: { userName: user.userName, role: user.role },
    //   accessToken,
    // });

    next();
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    data: users,
  });
};

exports.getUser = async (req, res, next) => {
  try {
    const userName = req.body.userName;
    const user = await User.findOne({ userName: userName });
    if (!user) {
      return next(new Error('User does not exist'));
    }
    console.log(user);
    res.status(200).json({
      data: user,
    });
  } catch {
    next(error);
  }
};

// exports.updateUser = async (req, res, next) => {
//   try {
//     const update = req.body;
//     const userId = req.params.userId;
//     await User.findByIdAndUpdate(userId, update);
//     const user = await User.findById(userId);
//     res.status(200).json({
//       data: user,
//       message: 'User has been updated',
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export.
