
$(document).ready(()=>{
    if(currentuser){
        const url = 'https://ascentro.herokuapp.com/'
        const socket = io.connect(url);
        $('.modal').modal();
        socket.on('cart-msg', msg=>{
        
            Swal.fire({
                icon: 'error',
                title: '',
                html: msg,
                footer: '<a href>Contact us!</a>'
            }).then(res=>{
                window.location.reload()
            })
        })
        $(".buddy .card .addtocart").click((ev)=>{
            console.log(!$(ev.target).parent().hasClass('removefromcart'))
            $(ev.target).parent().toggleClass('aaa')
            console.log($(ev.target).parent())
            if(!$(ev.target).parent().hasClass('removefromcart')){
                $(ev.target).parent().toggleClass('removefromcart')
                socket.emit('add-to-cart', currentuser, $(ev.target).parent().parent().data('item-id').trim())
            } else if($(ev.target).parent().hasClass('removefromcart')){
                $(ev.target).parent().toggleClass('removefromcart')
                socket.emit('remove-from-cart', currentuser, $(ev.target).parent().parent().data('item-id').trim())
            }
             
        
        })
        /*$(".remove-cart-item i").click((ev)=>{
            console.log('dhw')
    
            socket.emit('remove-from-cart', currentuser, $(ev.target).parent().parent().data('item-id').trim())
        
            console.log($(ev.target).parent().parent().data('item-id').trim())
            $(ev.target).parent().parent().remove()
            location.reload();

        })*/

        $(".abonaments .card .addtocart").click((ev)=>{
            console.log('dhw')
            
            /*if($(ev.target).text().trim() == 'add_shopping_cart'){
                $(ev.target).text('remove_shopping_cart')
                socket.emit('add-to-cart-abonament', currentuser, $(ev.target).parent().parent().data('item-id').trim())
            } else if($(ev.target).text().trim() == 'remove_shopping_cart'){
                $(ev.target).text('add_shopping_cart')
                socket.emit('remove-from-cart-abonament', currentuser, $(ev.target).parent().parent().data('item-id').trim())
            }
            console.log($(ev.target).parent().parent().data('item-id').trim())
            */
           console.log($(ev.target).parent().parent())
           if($(ev.target).text().trim() == 'add_shopping_cart'){
                $('.abonaments .card .addtocart i').text('add_shopping_cart')
                $(ev.target).text('remove_shopping_cart')
                socket.emit('set-abonament', currentuser, $(ev.target).parent().parent().data('item-id').trim())
            } else if($(ev.target).text().trim() == 'remove_shopping_cart'){
                $('.abonaments .card .addtocart i').text('add_shopping_cart')
                $(ev.target).text('add_shopping_cart')
                socket.emit('set-abonament', currentuser, null)
            }
            console.log($(ev.target).parent().parent().data('item-id'))
        
        })
        $('#addressnr').change(()=>{
            var addrennr = 1
            $( "#addressnr option:selected" ).each(function() {
                addrennr = $( this ).val();
            });
            $( "#selectedaddr" ).text(`${addresses[addrennr].street}, ${addresses[addrennr].city}, ${addresses[addrennr].state==''? addresses[addrennr].county: addresses[addrennr].state}, ${addresses[addrennr].country}; Zip: ${addresses[addrennr].zip}`);
        })

    }
    
})