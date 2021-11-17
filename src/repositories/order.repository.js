import dayjs from 'dayjs';
import Order from '../models/order.model.js';
import objectToDotNotation from '../libs/objectToDotNotation.js';
const TAXRATE = 0.0087;

class OrderRepository {

    retrieveAll(filter) {
        return Order.find(filter);
    }

    transform(order){

        order.href = `/orders/${order._id}`;
        order.pizzeria.href = `/pizzerias/${order.pizzeria}`;
        order.customer.href = `/customers/${order.customer}`;

        let sub = 0;
        order.pizzas.forEach(p => {
            sub += p.price;
        });
        order.subTotal = sub;
        order.subTotal.toFixed(3);
        
        delete order._id;
        delete order.pizzeria;
        delete order.customer;

        return order;
    }

}

export default new OrderRepository();