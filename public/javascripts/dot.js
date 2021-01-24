
$(document).ready(()=>{
    if(currentuser){
        const url = 'https://ascentro.herokuapp.com/'
        const socket = io.connect(url);
        $(".card .addtocart").click((ev)=>{
            console.log('dhw')
            
            if($(ev.target).text().trim() == 'add_shopping_cart'){
                $(ev.target).text('remove_shopping_cart')
                socket.emit('add-to-cart', currentuser, $(ev.target).parent().parent().data('item-id').trim())
            } else if($(ev.target).text().trim() == 'remove_shopping_cart'){
                $(ev.target).text('add_shopping_cart')
                socket.emit('remove-from-cart', currentuser, $(ev.target).parent().parent().data('item-id').trim())
            }
            console.log($(ev.target).parent().parent().data('item-id').trim())
            
        
        })

    }
    
})