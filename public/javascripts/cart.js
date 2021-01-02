
var stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: 'auto',
    token: function(token) {
        var items = []
        var cartcontainer = document.querySelector('.cartcont')
        var cartelems = document.querySelectorAll('.r')
        cartelems.forEach(r =>{
            var quantity = r.getElementsByClassName('q')[0].value
            var id = $(r).data('item-id')
            items.push({
                id:id,
                quantity: quantity
            })
        })

        fetch('/scents/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                stripeTokenId: token.id,
                items: items
            })
        }).then((res)=>{
            return res.json()
        }).then(data=>{
            alert(data.message)
        }).catch(err=>{
            console.error(err)
        })
    }
})
console.log(cart)
function purchaseClicked() {
    var totalprice = 0;
    var i=0
    cart.forEach(el=>{
        totalprice += el.price * document.querySelectorAll('.q')[i].value
        i++;
    })
    var price = totalprice
    console.log(totalprice)
    stripeHandler.open({
        amount: price
    })
}
