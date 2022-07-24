const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

require('dotenv').config();

app.use(cors({ origin: '*' }));
app.use(express.json());

const url = process.env.MONGO_URL;

mongoose.connect(url, { useNewUrlParser: true }).then(() => {
  console.log('Mongoose Connected');
});
// const createdConnection = mongoose.connection;
// createdConnection.once('open', () => {
//   console.log('Connected to database');
// });

const userRouter = require('./routes/user');
const User = require('./models/user.model');

app.use(async (req, res, next) => {
  if (req.headers['x-access-token']) {
    const accessToken = req.headers['x-access-token'];
    const { userId, exp } = await jwt.verify(
      accessToken,
      process.env.JWT_SECRET
    );
    if (exp < Date.now().valueOf() / 1000) {
      return res.status(401).json({ error: 'JWT token expired' });
    }
    res.locals.loggedInUser = await User.findById();
    next();
  } else {
    next();
  }
});

app.use('/rest', userRouter);

const port = 4000 || process.env.PORT;

app.listen(port, () => {
  console.log(`Node server is running on port ${port}`);
});
