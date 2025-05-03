const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const KoszykSchema = new Schema({
    produktId: {type: Schema.Types.ObjectId, ref: 'Produkt', required: true},
    ilosc: {type: Number, required: true},
    creatorUserId: {type:Schema.Types.ObjectId, ref: 'Uzytkownik', required: true},
    isDeleted: {type: Boolean, default: false},
})

module.exports = mongoose.model('Koszyk', KoszykSchema);