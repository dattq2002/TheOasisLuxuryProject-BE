import express from 'express';
import usersRouter from './routes/users.routes';

const app = express();

const port = 5000;

app.get('/', (req, res) => {
  res.send('Welcome to OaSis Luxury API');
});
app.use('/api/v1', usersRouter);
app.listen(port, () => {
  console.log(`The OaSis Luxury này đang chạy trên post ${port}`);
});
