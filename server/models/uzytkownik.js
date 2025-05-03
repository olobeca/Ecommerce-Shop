const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const UzytkownikSchema = new Schema({
    login: {type: String, required: true},
    haslo: {type: String, required: true},
    email: {type: String, required: true},
    isAdmin: {type: Boolean, default: false}, 
}) 

module.exports = mongoose.model('uzytkownik', UzytkownikSchema); 