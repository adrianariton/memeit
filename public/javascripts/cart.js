 
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
var capsulaprice = 0;
var capsulaCount = 0;
var capsulaRed= 0;
var capsulaBlack =0;
$('.q').change(()=>{
    document.querySelectorAll('.q').forEach(q=>{
        if(q.value==0){
            q.value=1;
        }
    })
    
    document.querySelectorAll('.qcap').forEach(q=>{
        if(q.value==0){
            q.value=1;
        }
    })
})
$('.qcap').change(()=>{
    document.querySelectorAll('.q').forEach(q=>{
        if(q.value==0){
            q.value=1;
        }
    })
    document.querySelectorAll('.qcap').forEach(q=>{
        if(q.value==0){
            q.value=1;
        }
    })
})
const updatePrices = ()=>{
    if(discount != null){
        $('span#discount').text(`Discount: ${discount}%`)
        var totalprice = 0;
        console.log(totalprice)
        var i=0
        cart.forEach(el=>{
            totalprice += el.price * document.querySelectorAll('.q')[i].value
            i++;
        })
        capsulaRed = document.querySelectorAll('.qcap')[0].value
        capsulaBlack = document.querySelectorAll('.qcap')[1].value
        capsulaCount = Number(capsulaRed)+Number(capsulaBlack)
        capsulaprice = 3000 * (document.querySelectorAll('.qcap')[0].value-1)
        console.log('Disount: ' + discount)
        if(capsulaprice<0){
            capsulaprice=0
        }
        var cartelems = document.querySelectorAll('.r')
        $('span.perfumes').text('Perfumes: ' + Math.round(totalprice*100.0)/10000 + ' Lei')
        $('span.capsules').text('Capsule: ' + Math.round(capsulaprice*100.0)/10000 + ' Lei')
        totalprice+=capsulaprice
        $('span.total').text('Total: ' + Math.round((100-discount)/100 * (totalprice)*100.0)/10000 + ' Lei')
        
    }
    $('.donebutton').show()

}
function cClicked() {
    $('.cart-q').slideUp()
    updatePrices()
    $('.cart-a').fadeIn()

}
function backClicked() {

    $('.cart-a').slideUp()
    updatePrices()

    $('.cart-q').slideDown()
    
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
                addressnr: $('#addressnr').val(),
                capsulesNo: capsulaCount,
                capsulaRed: capsulaRed,
                capsulaBlack: capsulaBlack

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

$(document).ready(()=>{
    $('.q').change(()=>{
        console.log('heeef')
        var itemCount = 0
        document.querySelectorAll('.q').forEach(q=>{
            itemCount += parseInt(q.value, 10)
        })
        console.log('Itemcount: ' + itemCount)
        if(itemCount == 2){
            discount = 10
        }else if(itemCount == 3){
            discount = 15
        } else {
            discount = 0
        }
        if(itemCount == 2){
            $('.oferteavem span').text('Mai adauga un parfum pentru o reducere de 15%!')
        } else if(itemCount == 1){
            $('.oferteavem span').text('Mai adauga un parfum pentru o reducere de 10%!')
        } else if(itemCount == 3){
            $('.oferteavem span').text('Reducere 15%!')
        } else {
            $('.oferteavem span').text('No discounts available!')

        }
        console.log(discount)
        updatePrices()
    })
})
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
    console.log(capsulaCount +' VALUE')
    fetch('/scents/purchase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            items: items,
            capsulesNo: capsulaCount
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