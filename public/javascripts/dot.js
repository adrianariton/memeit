
$(document).ready(()=>{
    if(true){
        const url = 'https://ascentro.herokuapp.com/'
        //const url = 'http://localhost:3000/'
        const socket = io.connect(url);
        $('.modal').modal();
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
                } else if($(ev.target).parent().hasClass('removefromcart')){
                    $(ev.target).parent().toggleClass('removefromcart')
                    socket.emit('remove-from-cart', currentuser, $(ev.target).parent().parent().data('item-id').trim())
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
                    localStorage.setItem('localcart', JSON.stringify(localCart));
                    console.log('Local cart:' + localStorage.getItem('localcart'))
                } else {
                    $(ev.target).parent().toggleClass('removefromcart')
                    const index = localCart.indexOf(item);
                    if (index > -1) {
                        localCart.splice(index, 1);
                    }
                    localStorage.setItem('localcart', JSON.stringify(localCart));
                    console.log('Local cart:' + localStorage.getItem('localcart'))
                }   
                /*Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    html: `You have to log in! Go to <a href='/users/login/'>Login Page</a>!`,
                    footer: '<a href>Contact us!</a>'
                })*/
            }
            
            
             
        
        })
        $(".remove-cart-item i").click((ev)=>{
            console.log('dhw')
    
            socket.emit('remove-from-cart', currentuser, $(ev.target).parent().parent().data('item-id').trim())
        
            console.log($(ev.target).parent().parent().data('item-id').trim())
            $(ev.target).parent().parent().remove()
            location.reload();

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
        if(window.location.pathname == '/scents/cart' && currentuser && localCart != [] && localStorage.getItem('localcart')!='null'){
            socket.emit('add-to-cart', currentuser, JSON.parse(localCart))
            localStorage.clear()
            
            console.log('CART: ' +localStorage.getItem('localcart'))
        }
    }
    
})