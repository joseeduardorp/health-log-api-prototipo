import express from 'express';

import { router } from './routes';
import { errorHandler } from './utils/errorHandler';

const app = express();

app.use(express.json());

app.use(router);
app.use(errorHandler);

export default app;
