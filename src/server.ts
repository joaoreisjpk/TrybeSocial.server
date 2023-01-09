import express from 'express';
import cors from 'cors';
import router from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

const { PORT } = process.env;
app.listen(PORT, () => console.log(`server online on port ${PORT}`));
