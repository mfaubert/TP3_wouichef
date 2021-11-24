import express from 'express';
import HttpError from 'http-errors';

import OrderRepository from '../repositories/order.repository.js';
import validator from '../middlewares/validator.js';
import paginate from 'express-paginate';

const router = express.Router();

class OrdersRoutes {
    constructor() {
        router.get('/', paginate.middleware(10, 30), this.getAll);
    }

    async getAll(req, res, next) {
        
        const retrieveOptions = {
            limit:req.query.limit,
            topping:req.query.topping
        };

        try {
            let [orders, documentsCount] = await OrderRepository.retrieveAll(retrieveOptions);

            orders = orders.map(o => {
                o = o.toObject({getters:false, virtuals:false});
                o = OrderRepository.transform(o);
                return o;
            });

            const pageCount = Math.ceil(documentsCount/req.query.limit);
            const hasNextPage = (paginate.hasNextPages(req))(pageCount);
            const pageArray = paginate.getArrayPages(req)(3, pageCount, req.query.page);

            const response = {
                _metadata: {
                    hasNextPage: hasNextPage,
                    page: req.query.page,
                    limit: req.query.limit,
                    totalPages: pageCount,
                    totalDocuments: documentsCount
                },
                _links:{
                    first:`/orders?page=1&limit=${req.query.limit}`,
                    prev:pageArray[0].url,
                    self:pageArray[1].url,
                    next:pageArray[2].url,
                    last:`/orders?page=${pageCount}&limit=${req.query.limit}`
                },
                data:orders
            };

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

}

new OrdersRoutes();
export default router;
