import express from 'express';
import usersRouter from './routes/users.routes';

const app = express();

const port = 5000;

app.get('/', (req, res) => {
  res.send('hello world');
});
usersRouter.get('/tweets', (req, res) => {
  res.json({
    data: [
      { fname: 'Điệp', yob: 1999 },
      { fname: 'Hùng', yob: 2003 },
      { fname: 'Được', yob: 1994 }
    ]
  });
});
app.use('/api/v1', usersRouter);
app.listen(port, () => {
  console.log(`The OaSis Luxury này đang chạy trên post ${port}`);
});
