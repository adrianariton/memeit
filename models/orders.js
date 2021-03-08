var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const { Double, connect } = require('mongodb');
const { ObjectID } = require('mongodb');
var Subscriptions = require('../models/subscriptions')
var nodemailer = require('nodemailer');

mongoose.connection.on('connected', ()=>{
    console.log('Connecred to mongo~~~~~~~~~~~~~~')
})
//User schema
function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
function oneMonthFromNow() {
    var d = new Date();
    
    return addDays(d, 3);
}
var OrdersSchema = mongoose.Schema({
    amount: {
        type: Number
    },
    currency: {
        type: String,
        default: 'lei'
    },
    email: {
        type: String
    },
    userID: {
        type: ObjectID
    },
    shipping: {
        type: Object
    },
    status: {   //delivered / ordered/ failed / canceled
        type: String,
        default: 'ordered'
    },
    products: {
        type: Object
    },
    deliverymethod: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    subscriptionsId: {
        type: [],
        default: []
    },
    date: {
        type: Date,
        default: Date.now()
    },
    deliveryDate: {
        type: Date,
        default: oneMonthFromNow

    },
    discountPercentage: {
        type: Number,
        default: 0
    },
    itemCount: {
        type: Number
    },
    capsulesCount: {
        type: Number,
        default: 1
    },
    capsulesType: {
        type: Object
    }
})

var Orders = module.exports = mongoose.model('Orders', OrdersSchema);


module.exports.getOrdersByUID = function(id, callback){
    var query = {userID: id};
    Orders.find(query, callback)
}

module.exports.create = function(newP, callback){
    newP.save(callback)
}
/*
module.exports.cancelOrder = function(id, callback){
    Orders.updateOne({_id: id}, {
        $set: {status: 'canceled'}
    }).then((err, res)=>{
        Orders.findById(id, (err, order)=>{
            order.subscriptionsId.forEach(element => {
                Subscriptions.cancelSubscription(element, (errsub, result)=>{
                    console.log(errsub, result)
                })
            });
            callback()
        })
    })
    
}*/

module.exports.sendThroughMail = function(order, callback){
    var transporter = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
        port: 465,
        auth: {
          user: process.env.EMAIL_NAME,
          pass: process.env.EMAIL_PASS
        }
    });
    var htm =``
    var mailOptions = {
        from: process.env.EMAIL_NAME,
        to: order.email,
        subject: `Ati plasat o comanda!`,
        html:`

        <div style='width: 100% !important;'>
            

            <div style='width: 100% !important;display:table; flex-direction: column; justify-content: center; align-items: center;'>
            
                <h1 style='display:table-row;'>Ascent</h1>
                <h2 style='display:table-row;'>Salut ${order.shipping.name}, iti multumim pentru comanda si speram ca ti-a placut sa descoperi universul Ascent!</h2>
            </div>
            <div style='margin-top:5em;width: 100% !important;display:table; flex-direction:row; justify-content: space-between; align-items: center;'>
                <div style='display:table-cell; flex-direction:column; justify-content: center; align-items: center;'>
                    
                    <h3 style='display:table-row;'>Detalii livrare...</h3>
                    <span style='display:table-row;'>${order.shipping.address.line1}</span>
                    <span style='display:table-row;'>${order.shipping.address.city}</span>
                    <span style='display:table-row;'>${order.shipping.address.state}</span>
                    <span style='display:table-row;'>${order.shipping.address.country}</span>
                    <span style='display:table-row;'>Cod Postal: ${order.shipping.address.postal_code}</span>



                </div>
                <div style='display:table-cell; flex-direction:column; justify-content: center; align-items: center;'>
                    <h3 style='display:table-row;'>Cand va fi livrata...</h3>
                    <span style='display:table-row;'>Livrata prin ${order.deliverymethod == 'postro' ? 'Posta Romana':'Curier'}</span>
                    <span style='display:table-row;'>Comandata la data de ${order.createdAt}</span>
                    <span style='display:table-row;'>Va fi primita pe sau inainte de ${order.deliveryDate}</span>

                </div>
        
            </div>
            
            <div style='width: 100%;margin-top:5em;display:table; flex-direction:column; justify-content: center; align-items: center;'>
                <h3 style='display:table-row;'>Ce ati comandat...</h3>
                <span style='display:table-row;'>Id-ul comenzii: ${order._id}</span>
                <a style='display:table-row;' href='https://www.ascentperfumes.com/myorders/${order._id}'>Accesati comanda!</a>
            </div>
            
            <div style='width: 100%;margin-top:5em;display:table; flex-direction:column; justify-content: center; align-items: center;'>
                <h3 style='display:table-row;'>Metoda de plata...</h3>
                <span style='display:table-row;'>Ramburs</span>
                <h4 style='display:table-row;'>In cazul in care doriti sa anulati comanda, sunati-ne la 0775 203 553 sau lasati un email la ascent.romania.help@gmail.com</h4>
                <span style='display:table-row;'>Comanda se poate anula in cel mult o ora de la plasare!</span>
            </div>
        </div>

        `
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          callback(error)
        } else {
          console.log('Email sent: ' + info.response);
            callback(null)
        }
    });
}