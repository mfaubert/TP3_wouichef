import express from 'express';
import paginate from 'express-paginate';

import customerRepository from '../repositories/customer.repository.js';
import validator from '../middlewares/validator.js';
import customerValidator from '../validators/customer.validator.js';

const router = express.Router();

class CustomerRoutes {
    constructor() {
        router.get('/', paginate.middleware(20, 40), this.getAll);
        router.get('/:customerId', this.getOne);
        router.put('/:customerId', customerValidator.complete(), validator, this.put);
    }

    async getAll(req, res, next) {

        const filter = {};
        if (req.query.planet) {
            filter.planet = req.query.planet;
        }

        const retrieveOptions = {
            skip: req.skip,
            limit: req.query.limit
        };

        try {
            let [customers, documentCount] = await customerRepository.retrieveAll(retrieveOptions, filter);

            customers = customers.map(c => {
                c = c.toObject({ getters: false, virtuals: false });
                c = customerRepository.transform(c);
                return c;
            });

            const pageCount = Math.ceil(documentCount / req.query.limit);
            const hasNextPage = paginate.hasNextPages(req)(pageCount);

            // Pour obtenir les -1, current, +1
            // MF: La fonction retourne une autre fonction, on l'appelle directement
            const pageArray = paginate.getArrayPages(req)(3, pageCount, req.query.page);

            const response = {
                _metadata: {
                    hasNextPage: hasNextPage,
                    page: req.query.page,
                    limit: req.query.limit,
                    skip: req.skip,
                    totalPages: pageCount,
                    totalDocuments: documentCount,
                },
                _links: {
                    first: `/customers?page=1&limit=${req.query.limit}`,
                    prev: pageArray[0].url,
                    self: pageArray[1].url,
                    next: pageArray[2].url,
                    last: `/customers?page=${pageCount}&limit=${req.query.limit}`
                },
                data: customers
            }

            if (req.query.page === 1) {
                delete response._links.prev;
                response._links.self = pageArray[0].url;
                response._links.next = pageArray[1].url;
            }

            if (!hasNextPage) {
                response._links.prev = pageArray[1].url;
                response._links.self = pageArray[2].url;
                delete response._links.next;
            }

            res.status(200).json(response);
        } catch (err) {
            return next(err);
        }

    }

    async getOne(req, res, next) {
        const idCustomer = req.params.customerId;

        try {
            let customer = await customerRepository.retrieveById(idCustomer);

            if (customer) {
                res.status(200).json(customer);
            } else {
                //2. J'ai pas de planète
                return next(HttpError.NotFound(`La planète ${idCustomer} n'existe pas`));
            }
        } catch (err) {
            return next(err);
        }
    }

    // Put en sql est comme un delete suivi d'un insert
    // Si la ressource n'existe pas encore, on ne fait qu'un insert (create)
    async put(req, res, next) {

        try {
            let customer = await customerRepository.update(req.params.customerId, req.body);
            console.log(customer);

            if (!customer) {
                return next(HttpError.NotFound(`Le client avec l'identifiant ${req.params.customerId} n'existe pas`));
            }

            if (req.query._body === 'false') {
                res.status(200).end();
            } else {
                res.status(200).json(customer);
            }

        } catch (err) {
            return next(err);
        }
    }
}

new CustomerRoutes();
export default router;
