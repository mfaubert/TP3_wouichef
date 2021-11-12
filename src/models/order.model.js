import mongoose from 'mongoose';
import {PIZZA_SIZES, PIZZA_TOPPINGS } from '../data/constants.js';

const orderSchema = mongoose.Schema({

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required:true
    },
    pizzeria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pizzeria',
        required:true
    },
    orderDate: { type:Date, required:true, default:Date.now},
    pizzas: [{
        size: { type:String, required:true, enum:PIZZA_SIZES},
        price: { type:String, required:true, min:0},
        topping: [{ type:String, required:true, enum:PIZZA_TOPPINGS}],
    }],
}, {
    collection: 'orders'
});

export default mongoose.model('Pizzeria', orderSchema);