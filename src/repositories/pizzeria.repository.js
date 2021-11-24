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

    transform(pizzeria, transformOptions = {}) {

        if (transformOptions) {
            if (transformOptions.embed && transformOptions.embed.orders) {
                pizzeria.orders = pizzeria.orders.map(o => {
                    o = orderRepository.transform(o, transformOptions);
                    return o;
                });
            }
        }

        pizzeria.href = `/pizzerias/${pizzeria._id}`;
        pizzeria.lightspeed = "[" + pizzeria.planet + "]@(" + pizzeria.coord.lat + ";" + pizzeria.coord.lon + ")";
        
        delete pizzeria._id;
        return pizzeria;
    }

}

export default new PizzeriaRepository();