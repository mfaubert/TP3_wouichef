import express from 'express';
import HttpError from 'http-errors';

import validator from '../middlewares/validator.js';
import PizzeriaRepository from '../models/pizzeria.repository.js';

const router = express.Router();

class PizzeriaRoutes {
    constructor() {
        router.get('/:idPizzeria', this.getOne);
    }

    async getOne(req, res, next) {
        const idPizzeria = req.params.idPizzeria;

        try {
            let pizzeria = await PizzeriaRepository.retrieveById(idPizzeria);

            res.status(200).json(pizzeria);
        } catch(err) {
            return next(err);
        }
    }
}

new PizzeriaRoutes();
export default router;
