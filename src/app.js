import express from 'express';

import database from './libs/database.js';

import errorMiddleware from './middlewares/errors.js';

import orderRoutes from './routes/order.routes.js';
import customerRoutes from './routes/customer.routes.js';
import pizzeriaRoutes from './routes/pizzeria.routes.js';

database();

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.header('base_url', process.env.BASE_URL);
    next();
});

app.use('/orders', orderRoutes);
app.use('/customers', customerRoutes);
app.use('/pizzerias', pizzeriaRoutes);

app.use(errorMiddleware);

export default app;