
$(document).ready(()=>{
    const url = 'https://ascentromania.herokuapp.com/'
    const socket = io.connect(url);
    $(".card .addtocart").click((ev)=>{
        socket.emit('add-to-cart', currentuser, $(ev.target).parent().children('.name').text())

        console.log((ev.target).parent().children('.name').text(), currentuser, scents)
        
    
    })
})