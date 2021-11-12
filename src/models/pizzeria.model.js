import mongoose from 'mongoose';
import { MONSTER_ANCESTORS, PIZZA_TOPPINGS, PLANET_NAMES } from '../data/constants.js';

const pizzeriaSchema = mongoose.Schema({

    planet: { type: String, required:true, enum:[PLANET_NAMES] },
    coord: {
        lon: { type: Number,min:-1000,max:1000, required:true,},
        lat: { type: Number,min:-1000,max:1000, required:true,}
    },
    chef: {
        name:{ type: String, required:true},
        ancestor: { type: String, required:true, enum:[MONSTER_ANCESTORS] },
        specialty: { type: String, required:true, enum:[PIZZA_TOPPINGS] }
    }
}, {
    collection: 'pizzerias'
});

export default mongoose.model('Pizzeria', pizzeriaSchema);