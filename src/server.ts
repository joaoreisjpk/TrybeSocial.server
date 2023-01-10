import express from 'express';
import cors from 'cors';
import router from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

const { PORT, DB_URL, JWT_SECRET } = process.env;
app.listen(PORT, () => {
  console.log(`server online on port ${PORT}`);
  console.log('DB_URL', DB_URL);
  console.log('JWT_SECRET', JWT_SECRET);
});
