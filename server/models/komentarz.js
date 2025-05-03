const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const komentarzSchema = new Schema({
    produktId: {type: Schema.Types.ObjectId, ref: 'Produkt', required: true},
    description: {type: String, required: true},
    rating: {type: Number, required: true},
    creationDate: {type: Date, default: Date.now},
    creatorUserId: {type:Schema.Types.ObjectId, ref: 'Uzytkownik', required: true},
    isDeleted: {type: Boolean, default: false},
})
module.exports = mongoose.model('Komentarz', komentarzSchema);