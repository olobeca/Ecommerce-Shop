const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const wyszukiwaniaSchema = new Schema({
    userId: {type:Schema.Types.ObjectId, ref: 'uzytkownik', required: true},
    tresc: {type: String, required: true},
}) 

module.exports = mongoose.model('wyszukiwania', wyszukiwaniaSchema); 