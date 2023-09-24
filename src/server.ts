import express from 'express';
import cors from 'cors';
import './websocket';
import router from './routes';

import { serverHttp, app } from './http';

app.use(cors());
app.use(express.json());
app.use(router);

const { PORT } = process.env;
serverHttp.listen(PORT, () => {
  console.log(`server online on port ${PORT}`);
});
