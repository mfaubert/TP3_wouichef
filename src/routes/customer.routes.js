import express from 'express';
import HttpError from 'http-errors';
import paginate from 'express-paginate';

import customerRepository from '../repositories/customer.repository.js';
import validator from '../middlewares/validator.js';
import customerValidator from '../validators/customer.validator.js';

const router = express.Router();

class CustomerRoutes {
    constructor() {
        router.get('/', paginate.middleware(20, 40), this.getAll);
        router.put('/:idCustomer', customerValidator.complete(), validator, this.put);
    }

    //Lorsque le paramètre d’URL est présent n’oublier pas d’ajuster le code pour 
    //compter le nombre de document.
    async getAll(req, res, next) {

        const filter = {};
        if (req.query.planet) {
            filter.planet = req.query.planet;
        }

        const retrieveOptions = {
            skip:req.skip,
            limit:req.query.limit
        };
        
        try {
            let [customers, documentCount] = await customerRepository.retrieveAll(retrieveOptions, filter);

            customers = customers.map(c => {
                c = c.toObject({getters:false, virtuals:false});
                c = customerRepository.transform(c);
                return c;
            });

            const pageCount = Math.ceil(documentCount/req.query.limit);
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
                    prev:pageArray[0].url,
                    self:pageArray[1].url,
                    next:pageArray[2].url,
                    last: `/customers?page=${pageCount}&limit=${req.query.limit}`
                },
                data:customers
            }

            // Contrôller pour avoir les bonnes informations à la première et la
            // dernière page
            if(req.query.page === 1) {
                delete response._links.prev;
                response._links.self = pageArray[0].url;
                response._links.next = pageArray[1].url;
            }

            if(!hasNextPage) {
                response._links.prev = pageArray[1].url;
                response._links.self = pageArray[2].url;
                delete response._links.next;
            }

            res.status(200).json(response);
        } catch(err) {
            return next(err);
        }

    }

    async put(req, res, next) {

    }

}

new CustomerRoutes();
export default router;
