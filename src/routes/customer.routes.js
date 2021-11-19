import express from 'express';
import HttpError from 'http-errors';

import CustomerRepository from '../repositories/customer.repository.js';
import validator from '../middlewares/validator.js';

const router = express.Router();

class CustomerRoutes {
    constructor() {
        router.get('/', this.getAll);
    }

    async getAll(req, res, next) {
        
        const filter = {};

        try {
            let customers = await CustomerRepository.retrieveAll(filter);

            customers = customers.map(c => {
                c = c.toObject({getters:false, virtuals:false});
                c= CustomerRepository.transform(c);
                return c;
            });

            res.status(200).json(customers);
        } catch(err) {
            return next(err);
        }

    }

}

new CustomerRoutes();
export default router;
