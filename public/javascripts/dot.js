
$(document).ready(()=>{
    if(true){
        const url = 'https://ascentro.herokuapp.com/'
        const socket = io.connect(url);
        $('.modal').modal();
        
        
        $(".buddy .card .addtocart").click((ev)=>{
            if(currentuser){
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
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    html: `You have to log in! Go to <a href='/users/login/'>Login Page</a>!`,
                    footer: '<a href>Contact us!</a>'
                })
            }
            
            
             
        
        })
        $(".remove-cart-item i").click((ev)=>{
            console.log('dhw')
    
            socket.emit('remove-from-cart', currentuser, $(ev.target).parent().parent().data('item-id').trim())
        
            console.log($(ev.target).parent().parent().data('item-id').trim())
            $(ev.target).parent().parent().remove()
            location.reload();

        })

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
           if(currentuser){
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
                console.log($(ev.target).parent().parent())
            
           } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                html: `You have to log in! Go to <a href='/users/login/'>Login Page</a>!`,
                footer: '<a href>Contact us!</a>'
            })
           }
            
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