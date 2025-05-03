const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const ProduktSchema = new Schema({
    title: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    imageUrl: {type: String, required: true},
    creationDate: {type: Date, default: Date.now},
    isAvailable: {type: Boolean, default: true},
    creatorUserId: {type:Schema.Types.ObjectId, ref: 'Uzytkownik', required: false}, 
    
}) 

module.exports = mongoose.model('Produkt', ProduktSchema); 