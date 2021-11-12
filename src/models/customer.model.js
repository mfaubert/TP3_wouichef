import mongoose from 'mongoose';

const customerSchema = mongoose.Schema({

    name: { type:String, required:true },
    email: { type:String, unique:true, required:true },
    planet: {         
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Planet', 
        required:true 
    }, 
    coord: {
        lon: { type:Number, required:true, min:-1000, max:1000 },
        lat: { type:Number, required:true, min:-1000, max:1000 }
    },
    phone: { type:String, maxLength:16 },
    birthday: { type:String, required:true },
    referalCode:String
}, {
    collection: 'pizzerias'
});

export default mongoose.model('Customer', customerSchema);