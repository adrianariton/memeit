
$(document).ready(()=>{
    var cartll = currentCartLength
    if(true){
        const url = 'https://ascentro.herokuapp.com/'
        //const url = 'http://localhost:3000/'
        const socket = io.connect(url);
        $('.modal').modal();
        var sessionCart = []
        var isCart = currentCartLength == 0 ? false : true
        var removed = 0;
        var onceremoved = 0;
        var totallen = currentCartLength + (false?  sessionCart.length:0 )+ JSON.parse(localStorage.getItem('localcart')).length
        $('.crt .before').text(totallen == 0 ? '+':totallen)
        if(totallen==0){
            $('.crt').removeClass('cartnotempty')
        } else {
            $('.crt').addClass('cartnotempty')
        }
        console.log(currentCartLength, sessionCart.length, JSON.parse(localStorage.getItem('localcart')).length)
        if(!currentuser){
            if(localStorage.getItem('localcart') == '' ||localStorage.getItem('localcart') == undefined || localStorage.getItem('localcart') == null){
                localStorage.setItem('localcart', JSON.stringify([]));
            }
            console.log('Cart:' + localStorage.getItem('localcart') + ':')
            var localCart =JSON.parse(localStorage.getItem('localcart'));
            if(localCart !=undefined && localCart!=null){
                localCart.forEach(id=>{
                    $(`.card*[data-item-id=${id}] .addtocart`).addClass('removefromcart')
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
                    onceremoved++;
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
                    onceremoved++;
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
            var localCart =JSON.parse(localStorage.getItem('localcart'));
            var totallen = currentCartLength + 0 + JSON.parse(localStorage.getItem('localcart')).length -(currentuser ?removed: 0)
            $('.crt .before').text(totallen == 0 ? '+':totallen)
            console.log(currentCartLength,0, JSON.parse(localStorage.getItem('localcart')).length, -removed,totallen)

            if(totallen==0){
                $('.crt').removeClass('cartnotempty')
            } else {
                $('.crt').addClass('cartnotempty')
            }
            console.log(totallen)
            
             
        
        })
        $(".remove-cart-item i").click((ev)=>{
            console.log('dhw')
            cartll--;
            var totallen = cartll
            $('.crt .before').text(totallen == 0 ? '+':totallen)
            
            if(totallen==0){
                location.reload()
                $('.crt').removeClass('cartnotempty')
            } else {
                $('.crt').addClass('cartnotempty')
            }
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
        if(window.location.pathname =='/' && currentuser){
            localStorage.setItem('localcart', JSON.stringify([]));

            var localCart =JSON.parse(localStorage.getItem('localcart'));
            var totallen = currentCartLength
            $('.crt .before').text(totallen == 0 ? '+':totallen)
        }        
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