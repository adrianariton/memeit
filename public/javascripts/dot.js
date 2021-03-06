
$(document).ready(()=>{
    if(true){
        const url = 'https://ascentro.herokuapp.com/'
        //const url = 'http://localhost:3000/'
        const socket = io.connect(url);
        $('.modal').modal();
        var sessionCart = []
        var isCart = currentCartLength == 0 ? false : true
        var removed = 0;
        if(!currentuser){
            if(localStorage.getItem('localcart') == '' ||localStorage.getItem('localcart') == undefined || localStorage.getItem('localcart') == null){
                localStorage.setItem('localcart', JSON.stringify([]));
            }
            console.log('Cart:' + localStorage.getItem('localcart') + ':')
            var localCart =JSON.parse(localStorage.getItem('localcart'));
            if(localCart !=undefined && localCart!=null){
                localCart.forEach(id=>{
                    $(`.card*[data-item-id=${id}]`).addClass('removefromcart')
                })
            }
        }
        $(".buddy .card .addtocart").click((ev)=>{
            if(currentuser){
                console.log(!$(ev.target).parent().hasClass('removefromcart'))
                console.log($(ev.target).parent())
                if(!$(ev.target).parent().hasClass('removefromcart')){
                    $(ev.target).parent().toggleClass('removefromcart')
                    socket.emit('add-to-cart', currentuser, $(ev.target).parent().parent().data('item-id').trim())
                    sessionCart.push(item)
                    removed--;
                } else if($(ev.target).parent().hasClass('removefromcart')){
                    $(ev.target).parent().toggleClass('removefromcart')
                    socket.emit('remove-from-cart', currentuser, $(ev.target).parent().parent().data('item-id').trim())
                    const index = sessionCart.indexOf(item);
                    if (index > -1) {
                        sessionCart.splice(index, 1);
                    }
                    removed++;
                }    
            } else {
                if(localStorage.getItem('localcart') == ''||localStorage.getItem('localcart') == undefined || localStorage.getItem('localcart') == null){
                    localStorage.setItem('localcart', JSON.stringify([]));
                }
                var item = $(ev.target).parent().parent().data('item-id').trim()
                var localCart =JSON.parse(localStorage.getItem('localcart'));
                if(!localCart.includes(item)){
                    $(ev.target).parent().toggleClass('removefromcart')                   
                    localCart.push(item)
                    sessionCart.push(item)
                    removed--;
                    localStorage.setItem('localcart', JSON.stringify(localCart));
                    console.log('Local cart:' + localStorage.getItem('localcart'))
                } else {
                    $(ev.target).parent().toggleClass('removefromcart')
                    const index = localCart.indexOf(item);
                    if (index > -1) {
                        localCart.splice(index, 1);
                    }
                    removed++;
                    localStorage.setItem('localcart', JSON.stringify(localCart));
                    console.log('Local cart:' + localStorage.getItem('localcart'))
                    const index2 = sessionCart.indexOf(item);
                    if (index2 > -1) {
                        sessionCart.splice(index2, 1);
                    }
                }   
                /*Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    html: `You have to log in! Go to <a href='/users/login/'>Login Page</a>!`,
                    footer: '<a href>Contact us!</a>'
                })*/
            }

            if(sessionCart.length >0){
                isCart = true
            }
            if(currentCartLength - removed <= 0){
                isCart = false;
            }
            localStorage.setItem('iscart', isCart)
            if(isCart == true){
                $('.crt').text('add_shopping_cart')
            } else {
                $('.crt').text('shopping_cart')

            }
            
             
        
        })
        $(".remove-cart-item i").click((ev)=>{
            console.log('dhw')
    
            socket.emit('remove-from-cart', currentuser, $(ev.target).parent().parent().data('item-id').trim())
        
            console.log($(ev.target).parent().parent().data('item-id').trim())
            $(ev.target).parent().parent().remove()
            //location.reload();
            var el=$(ev.target).parent().parent()
            console.log($(el).data('name'))
                const index2 = cart.find(item=> item.name = $(el).data('name'));
                console.log(index2)    
                if (index2 ) {
                        var ind = cart.indexOf(index2)
                        cart.splice(ind, 1);
                        console.log('Found at: '+ind)    

                    }
                    console.log(cart)
            var i=0;
            document.querySelectorAll('.cart-q .r.ab-group').forEach((el)=>{
                i++;
                $(el).find('span').text(i+'.')
                
            })
        })
        $('#addressnr').change(()=>{
            var addrennr = 1
            $( "#addressnr option:selected" ).each(function() {
                addrennr = $( this ).val();
            });
            $( "#selectedaddr" ).text(`${addresses[addrennr].street}, ${addresses[addrennr].city}, ${addresses[addrennr].state==''? addresses[addrennr].county: addresses[addrennr].state}, ${addresses[addrennr].country}; Zip: ${addresses[addrennr].zip}`);
        })

        if(localStorage.getItem('localcart') == ''||localStorage.getItem('localcart') == undefined || localStorage.getItem('localcart') == null){
            localStorage.setItem('localcart', JSON.stringify([]));
        }
        var localCart = localStorage.getItem('localcart')
        
        if(window.location.pathname == '/scents/loggedinfromcart'){
            console.log('ewg')
            if(currentuser && localCart != [] && localCart != ''&& localStorage.getItem('localcart')!='null'){
                console.log(localCart, localCart=='[]')
                if(localCart!='[]'){
                    socket.emit('add-to-cart', currentuser, JSON.parse(localCart))
                
                    console.log('CART: ' +localCart + ' ADDED')
    
                }
                //localStorage.clear()
                setTimeout(() => { 
                    localStorage.setItem('localcart', JSON.stringify([]));
                    window.location.pathname = '/scents/cart'
                }, 500);
            }
                        
        }
    }
    
})