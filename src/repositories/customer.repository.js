import dayjs from "dayjs";
import customer from '../models/customer.model.js';
import objectToDotNotation from '../libs/objectToDotNotation.js';

class CustomerRepository {

    retrieveAll(filter) {
        return customer.find(filter);
    }

    transform(customer){

        customer.href = `/customers/${customer._id}`;

        customer.age = parseFloat(((dayjs() - customer.birthday) / 31536000000).toFixed(0));
        customer.phone = "[" + customer.phone.substring(0,4) + "]" + customer.phone.substring(4,8) + "-" + customer.phone.substring(8,14) + "@" + customer.phone.substring(14,16);
        customer.lightspeed = "[" + customer.planet + "]@(" + customer.coord.lat + ";" + customer.coord.lon + ")";
        
        
        delete customer._id;

        return customer;
    }

}

export default new CustomerRepository();