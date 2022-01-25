
$(document).ready(()=>{
    var cartll = currentCartLength
    if(true){
        const url = 'https://guarded-retreat-42306.herokuapp.com/'
        //const url = 'http://localhost:3000/'
        const socket = io.connect(url);
        $('.modal').modal();
        var sessionCart = []
        var isCart = currentCartLength == 0 ? false : true
        var removed = 0;
        var onceremoved = 0;
        var lllen = 0;
        if (`${localStorage.getItem('localcart')}` != "null") {
            lllen = JSON.parse(localStorage.getItem('localcart')).length
             
        }
        var totallen = currentCartLength + (false?  sessionCart.length:0 )+ lllen;
        $('.crt .before').text(totallen == 0 ? '+':totallen)
        if(totallen==0){
            $('.crt').removeClass('cartnotempty')
        } else {
            $('.crt').addClass('cartnotempty')
        }
        if(!currentuser){
            if(localStorage.getItem('localcart') == '' ||localStorage.getItem('localcart') == undefined || localStorage.getItem('localcart') == null){
                localStorage.setItem('localcart', JSON.stringify([]));
            }
            var localCart =JSON.parse(localStorage.getItem('localcart'));
            if(localCart !=undefined && localCart!=null){
                localCart.forEach(id=>{
                    $(`.card*[data-item-id=${id}] .addtocart`).addClass('removefromcart')
                })
            }
        }
        $(".buddy .card .addtocart").click((ev)=>{

            if(currentuser){
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
                } else {
                    $(ev.target).parent().toggleClass('removefromcart')
                    const index = localCart.indexOf(item);
                    if (index > -1) {
                        localCart.splice(index, 1);
                    }
                    removed++;
                    onceremoved++;
                    localStorage.setItem('localcart', JSON.stringify(localCart));
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

            if(totallen==0){
                $('.crt').removeClass('cartnotempty')
            } else {
                $('.crt').addClass('cartnotempty')
            }
            
             
        
        })
        $(".remove-cart-item i").click((ev)=>{
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
        
            $(ev.target).parent().parent().remove()
            //location.reload();
            var el=$(ev.target).parent().parent()
                const index2 = cart.find(item=> item.name = $(el).data('name'));
                if (index2 ) {
                        var ind = cart.indexOf(index2)
                        cart.splice(ind, 1);

                    }
            var i=0;
            document.querySelectorAll('.cart-q .r.ab-group').forEach((el)=>{
                i++;
                $(el).find('span.index').text(i+'.')
                
            })
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
            if(currentuser && localCart != [] && localCart != ''&& localStorage.getItem('localcart')!='null'){
                if(localCart!='[]'){
                    socket.emit('add-to-cart', currentuser, JSON.parse(localCart))
                
    
                }
                //localStorage.clear()
                setTimeout(() => { 
                    localStorage.setItem('localcart', JSON.stringify([]));
                    window.location.pathname = '/scents/cart'
                }, 500);
            } else {
                setTimeout(() => { 
                    localStorage.setItem('localcart', JSON.stringify([]));
                    window.location.pathname = '/scents/cart'
                }, 500);
            }
                     
        }
    }
    
})