import { Router } from 'express';

const usersRouter = Router();

usersRouter.use(
  (req, res, next) => {
    console.log('Time: ', Date.now());
    next();
    // res.status(400).send('not allowed')
    // console.log(12345)
  },
  (req, res, next) => {
    console.log('Time 2: ', Date.now());
    next();
  }
);

export default usersRouter;
