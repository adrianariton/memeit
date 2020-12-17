
$(document).ready(()=>{
    if(currentuser){
        const url = 'https://ascentromania.herokuapp.com/'
        const socket = io.connect(url);
        $(".card .addtocart").click((ev)=>{
            console.log('dhw')
            
            if($(ev.target).text() == 'add_shopping_cart'){
                $(ev.target).text('remove_shopping_cart')
                socket.emit('add-to-cart', currentuser, $(ev.target).parent().parent().children('.name').text().trim())
            } else {
                $(ev.target).text('add_shopping_cart')
                socket.emit('remove-from-cart', currentuser, $(ev.target).parent().parent().children('.name').text().trim())
            }
            console.log($(ev.target).parent().parent().find('.name').text().trim())
            
        
        })
    }
    
})