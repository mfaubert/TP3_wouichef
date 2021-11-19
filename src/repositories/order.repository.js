import dayjs from 'dayjs';
import Order from '../models/order.model.js';
import pizzeriaRepository from './pizzeria.repository.js';
import objectToDotNotation from '../libs/objectToDotNotation.js';
const TAXRATE = 0.0087;

class OrderRepository {

    retrieveAll(filter) {
        return Order.find(filter);
    }

    transform(order, transformOptions = {}) {

        if (transformOptions.embed && transformOptions.embed.pizzeria) {
            order.pizzeria = pizzeriaRepository.transform(order.pizzeria, transformOptions);
        } else {
            order.pizzeria = { href: `/pizzerias/${order.pizzeria}` };
        }

        order.href = `/orders/${order._id}`;

        let piz = order.pizzeria;
        let cus = order.customer;
        delete order.pizzeria;
        delete order.customer;
        order.pizzeria = {};
        order.customer = {};
        order.pizzeria.href = `/pizzerias/${piz}`;
        order.customer.href = `/customers/${cus}`;

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