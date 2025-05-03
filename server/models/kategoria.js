const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const kategoriaSchema = new Schema({
    name : {type: String, required: true},
    isDeleted: {type: Boolean, default: false},
    products: [{ type: Schema.Types.ObjectId, ref: 'Produkt' , required: false}],
    
})
module.exports = mongoose.model('Kategoria', kategoriaSchema); 

