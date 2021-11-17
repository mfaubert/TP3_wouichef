import express from 'express';

import database from './libs/database.js';

import errorMiddleware from './middlewares/errors.js';

//import planetsRoutes from './routes/planets.routes.js';
//import explorationsRoutes from './routes/explorations.routes.js';

import a from './models/customer.model.js'
import b from './models/order.model.js'
import c from './models/pizzeria.model.js'

database();

const app = express();

app.use(express.json());

app.use((req,res,next) => {


    res.header('base_url', process.env.BASE_URL);
    next();
});

//app.use('/planets', planetsRoutes);
//app.use('/explorations', explorationsRoutes);

app.use(errorMiddleware);

export default app;