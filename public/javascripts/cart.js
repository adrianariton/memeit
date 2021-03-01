 
var stripe = Stripe(stripePublicKey)
var elements = stripe.elements();
var card = elements.create('card', {
    'style': {
      'base': {
        'fontFamily': 'Arial, sans-serif',
        'fontSize': '24px',
        'color': 'white',
      },
      'invalid': {
        'color': 'red',
      },
    }
});
function cClicked() {
    $('.cart-q').slideUp()
    var totalprice = 0;
    console.log(totalprice)
    var i=0
    cart.forEach(el=>{
        totalprice += el.price * document.querySelectorAll('.q')[i].value
        i++;
    })
    
    var cartelems = document.querySelectorAll('.r')
    console.log(1.0/3)
    $('span.perfumes').text('Perfumes: ' + Math.round(totalprice*100.0)/10000 + ' Lei')
    $('span.total').text('Total: ' + Math.round((100-discount)/100 * (totalprice)*100.0)/10000 + ' Lei')

    $('.cart-a').fadeIn()
}
function backClicked() {
    $('.cart-q').slideDown()
    
    $('.cart-a').fadeOut()
}
function doneClicked() {
    var totalprice = 0;
    var i=0
    $('.donebutton').hide()
    $('.wariningafterclick').show()
    cart.forEach(el=>{
        totalprice += el.price * document.querySelectorAll('.q')[i].value
        i++;
    })
    var price = totalprice
    console.log(totalprice)
    var items = []
    var cartcontainer = document.querySelector('.cartcont')
    var cartelems = document.querySelectorAll('.r')
    cartelems.forEach(r =>{
        var quantity = r.getElementsByClassName('q')[0].value
        var id = $(r).data('item-id')
        items.push({
            id:id,
            quantity: quantity
        })
    
    })
    
    if($('#deliverymethod').val() != null &&  $('#addressnr').val() != null) {
        fetch('/scents/done', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                items: items,
                deliverymethod: $('#deliverymethod').val(),
                addressnr: $('#addressnr').val()
            })
        }).then((res)=>{
            
            return res.json()
        }).then(data=>{
            if(data.error){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! ' + data.error.message,
                    footer: '<a href>Contact us!</a>'
                })
            } else {
                console.log(data.order)
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: data.message,
                    footer: `<a href='/myorders/${data.order._id}'>View my order!</a>`
                })
            }
            
            
        }).catch(err=>{
            console.error(err)
        })
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill in all required fields!',
            footer: '<a href>Contact us!</a>'
        })
    }
    
}
function purchaseClicked() {
    var totalprice = 0;
    var i=0
    $('.buybutton').hide()
    $('.wariningafterclick').show()
    cart.forEach(el=>{
        totalprice += el.price * document.querySelectorAll('.q')[i].value
        i++;
    })
    var price = totalprice
    console.log(totalprice)
    var items = []
    var cartcontainer = document.querySelector('.cartcont')
    var cartelems = document.querySelectorAll('.r')
    cartelems.forEach(r =>{
        var quantity = r.getElementsByClassName('q')[0].value
        var id = $(r).data('item-id')
        items.push({
            id:id,
            quantity: quantity
        })
    })

    fetch('/scents/purchase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            items: items
        })
    }).then((res)=>{
        
        return res.json()
    }).then(data=>{
        if(data.error){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong! Payment could not be initiated! ' + data.error.message,
                footer: '<a href>Contact us!</a>'
            })
        } else {
            var clientSecret = data.client_secret;
            stripe.confirmCardPayment(clientSecret,{
                payment_method: {card: card}
            }).then((result)=>{
                console.log(result)

                if(result.error){
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong! ' + result.error.message,
                        footer: '<a href>Contact us!</a>'
                    })
                } else {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: data.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
        }
        
        
    }).catch(err=>{
        console.error(err)
    })
}
$(document).ready(()=>{

    // Add an instance of the card UI component into the `card-element` <div>
   // card.mount('#card-element');
        
   $('.cart-a').hide()

   // console.log(cart)
    

})