import dayjs from "dayjs";
import Customer from '../models/customer.model.js';
import objectToDotNotation from '../libs/objectToDotNotation.js';

class CustomerRepository {

    retrieveAll(retrieveOptions, filter) {

        const retrieveQuery = Customer.find(filter).skip(retrieveOptions.skip).limit(retrieveOptions.limit).sort('birthday');
        const countQuery = Customer.estimatedDocumentCount();

        return Promise.all([retrieveQuery, countQuery]);
    }

    retrieveById(idCustomer) {
        return Customer.findById(idCustomer)
    }

    update(idCustomer, customerModifs) {
        const customerToDotNotation = objectToDotNotation(customerModifs);
        console.log(customerToDotNotation);
        return Customer.findByIdAndUpdate(idCustomer, customerToDotNotation, { new: true });
    }

    transform(customer) {

        customer.href = `/customers/${customer._id}`;

        customer.age = parseFloat(((dayjs() - customer.birthday) / 31536000000).toFixed(0));
        customer.phone = "[" + customer.phone.substring(0, 4) + "]" + customer.phone.substring(4, 8) + "-" + customer.phone.substring(8, 14) + "@" + customer.phone.substring(14, 16);
        customer.lightspeed = "[" + customer.planet + "]@(" + customer.coord.lat + ";" + customer.coord.lon + ")";


        delete customer._id;

        return customer;
    }

}

export default new CustomerRepository();