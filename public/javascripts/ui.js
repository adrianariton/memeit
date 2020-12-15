
const menu = document.querySelector(".menu")
const sidenav = document.querySelector(".sidenav")



menu.addEventListener("click", ()=>{
    sidenav.classList.toggle("active");

})
$(".card .readmore").click((ev)=>{
    console.log(ev.target)
    console.log($(ev.target).parent().toggleClass('readmore-active'))
    

})