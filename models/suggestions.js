var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const { Double, connect } = require('mongodb');
const { ObjectID } = require('mongodb');
 
mongoose.connection.on('connected', ()=>{
    console.log('Connecred to mongo~~~~~~~~~~~~~~')
})
//User schema

var SuggestionsSchema = mongoose.Schema({
    suggestion: {
        type: String
    },
    email: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

var Suggestions = module.exports = mongoose.model('Suggestions', SuggestionsSchema);

module.exports.create = function(newP, callback){
    newP.save(callback)
}
