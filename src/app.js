import express from 'express';

import database from './libs/database.js';

import errorMiddleware from './middlewares/errors.js';

import orderRoutes from './routes/order.routes.js';

database();

const app = express();

app.use(express.json());

app.use((req,res,next) => {
    res.header('base_url', process.env.BASE_URL);
    next();
});

app.use('/orders', orderRoutes);

app.use(errorMiddleware);

export default app;