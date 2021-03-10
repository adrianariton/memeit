 
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
$('#addaddress').click(()=>{
    console.log(document.querySelector('#addformcrt'))
    console.log({
        street: document.querySelector('#addformcrt')['street'].value,
        city: document.querySelector('#addformcrt')['city'].value,
        zip: document.querySelector('#addformcrt')['zip'].value,
        county: document.querySelector('#addformcrt')['county'].value,
        country: document.querySelector('#addformcrt')['country'].value,

    })
    fetch('/users/myaccount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            street: document.querySelector('#addformcrt')['street'].value,
            city: document.querySelector('#addformcrt')['city'].value,
            zip: document.querySelector('#addformcrt')['zip'].value,
            county: document.querySelector('#addformcrt')['county'].value,
            country: document.querySelector('#addformcrt')['country'].value,
            fromcart: true
        })
    }).then((res)=>{
        
        return res.json()
    }).then(data=>{
        if(data.error){
            Swal.fire({ 
                icon: 'error',
                title: 'Oops...',
                text: 'Ceva a mers rău! ' + data.error.message,
                footer: `<a href='mailto:ascent.romania.help@gmail.com' style="word-wrap: break-word !important;">Contactati-ne</a>`
            })
        } else {
            console.log(data.address)
            Swal.fire({
                icon: 'success',
                title: data.message,
            })
            var i = addresses.length
            addresses.push(data.address)
            console.log(addresses)
            console.log(document.querySelector('select#addressnr'))
            document.querySelector('select#addressnr').innerHTML += `
            <option value="${i}">Address ${i+1}</option>
            `
            document.querySelector('select#addressnr').value=i;
            disc()
            refr()
            if($('#addressnr')){
                $('#address-display').text(`${addresses[i].street}, ${addresses[i].city}, ${addresses[i].county}, ${addresses[i].country}; Zip: ${addresses[i].zip}`)
              
              }
        }
        
        
    }).catch(err=>{
        console.log(err)
    })
})
$('.q').change(()=>{
    disc()
    refr()
    document.querySelectorAll('.q').forEach(q=>{
        if(q.value==0){
            q.value=1;
        }
    })
    var qu = 0;
    document.querySelectorAll('.qcap').forEach(q=>{
        
        qu+=Number(q.value)
    })
    if(qu==0){
        document.querySelector('.qcap').value =1
        document.querySelectorAll('span.pr').forEach(q=>{
        
            q.innerHTML = '0 Lei'
        })
    } else {
        var i=0;
        document.querySelectorAll('.qcap').forEach(q=>{
            if(q.value == 0 || q.value ==1){
                document.querySelectorAll('span.pr')[i].innerHTML = '0 Lei'

            } else {
                document.querySelectorAll('span.pr')[i].innerHTML = '30 Lei'

            }
            i++;
        })
    }
    disc()
    refr()
})

function disc(){
    
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
}
function refr(){
    disc()
    var qu = 0;
    document.querySelectorAll('.qcap').forEach(q=>{
        
        qu+=Number(q.value)
    })
    console.log(qu)
    if(qu==0){
        document.querySelector('.qcap').value =1
        
    } else {
        var i=0, sw=0;
        document.querySelectorAll('.pr')[1].innerHTML = '30 x '+(qu-1)+ 'Lei' 
    }
    i=0
    document.querySelectorAll('.q').forEach(q=>{
        var str= document.querySelectorAll('span.pret')[i].innerHTML
        document.querySelectorAll('span.pret')[i].innerHTML = str.slice(0, -8) + ' x ' + q.value +' Lei'
        i++;
    })

    i=0
    
}
$('.arrowgroup .up').click((e)=>{
    var value = $(e.target).parent().parent().parent().find('input').val() 
    $(e.target).parent().parent().parent().find('input').val(Number(value)+1)
    console.log($(e.target).parent().parent().parent().attr('class'))
    
    var qu = 0;
    document.querySelectorAll('.qcap').forEach(q=>{
        
        qu+=Number(q.value)
    })
    refr()
})
$('.arrowgroup .down').click((e)=>{
    var value = $(e.target).parent().parent().parent().find('input').val() 
    if(value == 0){
        value =1;
    }
    $(e.target).parent().parent().parent().find('input').val(Number(value)-1)
    document.querySelectorAll('.q').forEach(q=>{
        if(q.value==0){
            q.value=1;
        }
    })
    refr()
    console.log($(e.target).parent().parent().parent().attr('class'))
})
$('.qcap').change(()=>{
    document.querySelectorAll('.q').forEach(q=>{
        if(q.value==0){
            q.value=1;
        }
    })
    disc()
    refr()
})
const updatePrices = ()=>{
    if(discount != null){
        $('span#discount').text(`Discount la parfumuri: ${discount}%`)
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
        capsulaprice = 3000 * (capsulaCount-1)
        console.log('Disount: ' + discount)
        if(capsulaprice<0){
            capsulaprice=0
            
        }
        var cartelems = document.querySelectorAll('.r')
        $('span.perfumes').text('Parfumuri: ' + Math.round(totalprice*100.0)/10000 + ' Lei')
        $('span.capsules').text('Capsule: ' + Math.round(capsulaprice*100.0)/10000 + ' Lei')
        //totalprice+=capsulaprice
        $('span.total').text('Total: ' + Math.round(((100-discount)/100*totalprice + capsulaprice)*100.0)/10000 + ' Lei')
        
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
                    text: 'Ceva a mers rău! ' + data.error.message,
                    footer: `<a href='mailto:ascent.romania.help@gmail.com' style="word-wrap: break-word !important;">Contactati-ne</a>`
                })
            } else {
                console.log(data.order)
                Swal.fire({
                    icon: 'success',
                    title: data.message,
                    footer: `<a href='/myorders/${data.order._id}'>Accesați comanda!</a>`
                })
            }
            
            
        }).catch(err=>{
            console.error(err)
        })
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Completați toate câmpurile!',
            footer: `<a href='mailto:ascent.romania.help@gmail.com' style="word-wrap: break-word !important;">Contactati-ne</a>`
        })
    }
    
}
$(document).ready(()=>{
    document.querySelectorAll('.q').forEach(q=>{
        if(q.value==0){
            q.value=1;
        }
    })
    
    var qu = 0;
    document.querySelectorAll('.qcap').forEach(q=>{
        
        qu+=Number(q.value)
    })
    if(qu==0){
        document.querySelector('.qcap').value =1
    }
    if(qu==0){
        document.querySelector('.qcap').value =1
        document.querySelectorAll('span.pr').forEach(q=>{
        
            q.innerHTML = '0 Lei'
        })
    } else {
        var i=0;
        document.querySelectorAll('.qcap').forEach(q=>{
            if(q.value == 0 || q.value ==1){
                document.querySelectorAll('span.pr')[i].innerHTML = '0 Lei'

            } else {
                document.querySelectorAll('span.pr')[i].innerHTML = '30 Lei'

            }
            i++;
        })
    }
})
$(document).ready(()=>{

    $('.q').change(()=>{
        disc()
        updatePrices()
    })
})
/*function purchaseClicked() {
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
                        text: 'Ceva a mers rău! ' + result.error.message,
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
}*/
$(document).ready(()=>{

    // Add an instance of the card UI component into the `card-element` <div>
   // card.mount('#card-element');
        
   $('.cart-a').hide()

   // console.log(cart)
    

})