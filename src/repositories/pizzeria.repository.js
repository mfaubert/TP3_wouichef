import Pizzeria from '../models/pizzeria.model.js';
import orderRepository from './order.repository.js';

class PizzeriaRepository {

    retrieveById(idPizzeria, retrieveOptions = {}) {

        const retrieveQuery = Pizzeria.findById(idPizzeria);

        if (retrieveOptions.orders) {
            retrieveQuery.populate('orders');
        }

        return retrieveQuery;
    }

    create(pizzeria) {
        return Pizzeria.create(pizzeria);
    }

    transform(pizzeria, transformOptions = {}) {

        if (transformOptions) {
            if (transformOptions.embed && transformOptions.embed.orders) {
                pizzeria.orders = pizzeria.orders.map(o => {
                    o = orderRepository.transform(o, transformOptions);
                    return o;
                });
            }
        }

        pizzeria.href = `${process.env.BASE_URL}/pizzerias/${pizzeria._id}`;
        pizzeria.lightspeed = "[" + pizzeria.planet + "]@(" + pizzeria.coord.lat + ";" + pizzeria.coord.lon + ")";

        delete pizzeria._id;
        delete pizzeria.id;

        return pizzeria;
    }

}

export default new PizzeriaRepository();