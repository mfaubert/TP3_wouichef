import express from 'express';
import HttpError from 'http-errors';

import OrderRepository from '../repositories/order.repository.js';
import validator from '../middlewares/validator.js';

const router = express.Router();

class OrdersRoutes {
    constructor() {
        router.get('/', this.getAll);
    }

    async getAll(req, res, next) {
        
        const filter = {};

        try {
            let orders = await OrderRepository.retrieveAll(filter);

            orders = orders.map(o => {
                o = o.toObject({getters:false, virtuals:false});
                o = OrderRepository.transform(o);
                return o;
            });

            res.status(200).json(orders);
        } catch(err) {
            return next(err);
        }

    }

}

new OrdersRoutes();
export default router;
