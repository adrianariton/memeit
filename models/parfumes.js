var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const { Double } = require('mongodb');
     
mongoose.connection.on('connected', ()=>{
    console.log('Connecred to mongo~~~~~~~~~~~~~~')
})
//User schema

var ParfumesSchema = mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    description: {
        type: String
    },
    aromas: {
        type: [String]
    },
    price: {
        type: Number
    },
    image: {
        type: String
    },
    mw: {
        type: String
    }
})

var Parfumes = module.exports = mongoose.model('Parfumes', ParfumesSchema);

module.exports.getParfumeById = function(id, callback){
    Parfumes.findById(id, callback);
}
module.exports.getParfumeByName = function(name, callback){
    var query = {name: username};
    Parfumes.findOne(query, callback)
}
module.exports.getMen = function(callback){
    var query = {mw: 'men'};
    Parfumes.find(query, callback)
}
module.exports.getWomen = function(callback){
    var query = {mw: 'women'};
    Parfumes.find(query, callback)
}
module.exports.create = function(newP, callback){
    newP.save(callback)
}