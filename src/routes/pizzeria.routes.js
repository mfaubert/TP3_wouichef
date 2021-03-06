import express from 'express';
import HttpError from 'http-errors';

import validator from '../middlewares/validator.js';
import pizzeriaRepository from '../repositories/pizzeria.repository.js';

const router = express.Router();

class PizzeriaRoutes {
    constructor() {
        router.get('/:idPizzeria', this.getOne);
        router.post('/', this.post);
    }

    async getOne(req, res, next) {
        const idPizzeria = req.params.idPizzeria;

        const retrieveOptions = {};
        const transformOptions = { embed: {} };

        if (req.query.embed && req.query.embed === 'orders') {
            retrieveOptions.orders = true;
            transformOptions.embed.orders = true;
        }

        try {
            let pizzeria = await pizzeriaRepository.retrieveById(idPizzeria, retrieveOptions);

            if (pizzeria) {
                pizzeria = pizzeria.toObject({ getters: false, virtuals: true });
                pizzeria = pizzeriaRepository.transform(pizzeria, transformOptions);
                // Succès: 200
                res.status(200).json(pizzeria);
            } else {
                // Echec 404 not found
                return next(HttpError.NotFound(`La pizzeria ${idPizzeria} n'existe pas`))
            }

        } catch (err) {
            // 500 Internal error         
            return next(err);
        }
    }

    async post(req, res, next) {
        const newPizzeria = req.body;

        try {
            let pizzeriaAdded = await pizzeriaRepository.create(newPizzeria);

            pizzeriaAdded = pizzeriaAdded.toObject({ getters: false, virtuals: false });
            pizzeriaAdded = pizzeriaRepository.transform(pizzeriaAdded);

            if (req.query._body === 'false') {
                res.status(204).end()
            } else {
                res.status(201).json(pizzeriaAdded);
            }

        } catch (err) {
            return next(err);
        }


    }
}

new PizzeriaRoutes();
export default router;
