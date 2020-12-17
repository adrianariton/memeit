
$(document).ready(()=>{
    if(currentuser){
        const url = 'https://ascentromania.herokuapp.com/'
        const socket = io.connect(url);
        $(".card .addtocart").click((ev)=>{
            console.log('dhw')
            socket.emit('add-to-cart', currentuser, $(ev.target).parent().parent().children('.name').text())
    
            console.log($(ev.target).parent().parent().find('.name').text())
            
        
        })
    }
    
})