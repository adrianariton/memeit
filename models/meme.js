const { ObjectID } = require('mongodb');
var mongoose = require('mongoose');
mongoose.connection.on('connected', ()=>{
    console.log('Connecred to mongo~~~~~~~~~~~~~~')
})
//User schema


var UserSchema = mongoose.Schema({
    title: {
        type: String,
    },
    image: {
        type: String
    },
    userID: {
        type: ObjectID
    },
    desc: {
        type: String
    }
})

var Meme = module.exports = mongoose.model('Meme', UserSchema);

module.exports.getMemeById = function(id, callback){
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        Meme.findOne({_id:id}, callback);

    } else {
        callback(null, null)
    }
}

module.exports.getMemesOfUser = function(id, callback){
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        Meme.find({userID: id}, callback);

    } else {
        callback(null, null)
    }
}

module.exports.getAll = function(callback){
        Meme.find({}, callback);

}
