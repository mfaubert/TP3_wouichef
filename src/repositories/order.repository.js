import dayjs from 'dayjs';
import Order from '../models/order.model.js';
import pizzeriaRepository from './pizzeria.repository.js';
import objectToDotNotation from '../libs/objectToDotNotation.js';
const TAXRATE = 0.0087;

class OrderRepository {

    retrieveAll(retrieveOptions) {
        let retrieveQuery = '';

        if (retrieveOptions.topping) {
            const filterFixed = {
                'pizzas.toppings': { $in: retrieveOptions.topping }
            }

            retrieveQuery = Order.find(filterFixed)
                .limit(retrieveOptions.limit)
                .sort('-orderDate')
        } else {
            retrieveQuery = Order.find()
                .limit(retrieveOptions.limit)
                .sort('-orderDate')
        }

        const countQuery = Order.countDocuments();
        return Promise.all([retrieveQuery, countQuery]);

    }

    transform(order, transformOptions = {}) {

        if (transformOptions.embed && transformOptions.embed.pizzeria) {
            order.pizzeria = pizzeriaRepository.transform(order.pizzeria, transformOptions);
        } else {
            order.pizzeria = { href: `${process.env.BASE_URL}/pizzerias/${order.pizzeria}` };
        }

        order.href = `${process.env.BASE_URL}/orders/${order._id}`;

        let cus = order.customer;
        delete order.customer;
        order.customer = {};
        order.customer.href = `${process.env.BASE_URL}/customers/${cus}`;

        let sub = 0;
        order.pizzas.forEach(p => {
            sub += p.price;
            delete p._id;
        });

        order.subTotal = parseFloat(sub.toFixed(3));
        order.taxeRates = TAXRATE;
        order.taxes = parseFloat((order.subTotal * TAXRATE).toFixed(3))
        order.total = parseFloat((order.subTotal + order.taxes).toFixed(3))

        delete order._id;

        return order;
    }

}

export default new OrderRepository();