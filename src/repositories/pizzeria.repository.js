import Pizzeria from '../models/pizzeria.model.js';

class PizzeriaRepository {

    retrieveById(idPizzeria) {

        return Pizzeria.findById(idPizzeria);     
    }

}

export default new PizzeriaRepository();