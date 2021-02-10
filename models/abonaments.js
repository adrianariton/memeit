var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const { Double } = require('mongodb');
     
mongoose.connection.on('connected', ()=>{
    console.log('Connecred to mongo~~~~~~~~~~~~~~')
})
//User schema

var AbonamentsSchema = mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    description: {
        type: String
    },
    parfumeChoices: {
        type: Number,
        default: 1
    },
    price: {
        type: Number
    },
    image: {
        type: String
    }
})

var Abonaments = module.exports = mongoose.model('Abonaments', AbonamentsSchema);

module.exports.getAbonamentById = function(id, callback){
    Abonaments.findById(id, callback);
}
module.exports.getAbonamentByName = function(name, callback){
    var query = {name: name};
    Abonaments.findOne(query, callback)
}
module.exports.create = function(newP, callback){
    newP.save(callback)
}