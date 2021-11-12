import mongoose from 'mongoose';

const pizzeriaSchema = mongoose.Schema({

    planet: { type: Date, default: Date.now, required:true },
    planet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Planet',
        required:true
    },
    coord: {
        lon: Number,
        lat: Number
    },
    scans: [{
        element: String,
        percent: Number,
        _id: false
    }],
    commment: String,
    id:false
}, {
    collection: 'pizzerias'
});

export default mongoose.model('Exploration', explorationSchema);