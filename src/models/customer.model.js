import mongoose from 'mongoose';
import { PLANET_NAMES } from '../data/constants.js';

const customerSchema = mongoose.Schema({

    name: { type:String, required:true },
    email: { type:String, unique:true, required:true },
    planet: { type: String, required:true, enum:PLANET_NAMES },
    coord: {
        lon: { type:Number, required:true, min:-1000, max:1000 },
        lat: { type:Number, required:true, min:-1000, max:1000 }
    },
    phone: { type:String, maxLength:16 },
    birthday: { type:Date, required:true },
    referalCode:String
}, {
    collection: 'customers'
});

export default mongoose.model('Customer', customerSchema);