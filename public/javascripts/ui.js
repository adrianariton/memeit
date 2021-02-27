
const menu = document.querySelector(".menu")
const sidenav = document.querySelector(".customsidenav")



//window.onscroll = function() {myFunction()};

var navbar = document.querySelector(".navbar");
var sticky = navbar.offsetTop;
var andu = document.querySelectorAll(".andu");
console.log(sticky)

document.body.addEventListener('scroll', () => {
  
  console.log(document.body.scrollTop)
  if (document.body.scrollTop <= sticky) {
    navbar.classList.add("navbar-unfix")
    andu.forEach ((x) => {
      x.classList.add("andu-unfix")
    })
    sidenav.classList.add("customsidenav-unfix")
  } else {
    navbar.classList.remove("navbar-unfix");
    andu.forEach ((x) => {
      x.classList.remove("andu-unfix")
    })
    sidenav.classList.remove("customsidenav-unfix")
  }
})

menu.addEventListener("click", ()=>{
    sidenav.classList.toggle("active");

})
$(".card .readmore").click((ev)=>{
    console.log(ev.target)
    console.log($(ev.target).parent().toggleClass('readmore-active'))
    

})

$(".split").click(function() {
    window.location = $(this).find("a").attr("href"); 
    return false;
});

$(document).ready(function(){
    $('.datepicker').datepicker();
});


$(document).ready(function(){
    $('.fixed-action-btn').floatingActionButton();
});
if(document.getElementById("cartbtn"))
dragElement(document.getElementById("cartbtn"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
$(document).ready(e=>{
  $('#subs').hide()
})

$('.togglesubs').click(e=>{
  $('#subs').toggle()
  if(  $('.togglesubs').text()=='Hide Subscriptions'  )
    $('.togglesubs').text('Show Subscriptions')
  else 
    $('.togglesubs').text('Hide Subscriptions')
})

$(document).ready(function(){
  $('.tooltipped').tooltip({
    position: 'bottom'
  });
  if($('.section.main')){
    $('.section.main .content').hide()
    $('.section.main .personal-data').show()
    $(`.section.main .title2#personal-data`).toggleClass('active')
  
    $('.section.main .title2').click(e=>{
      var id = $(e.target).attr('id')
      console.log(id)
      $('.section.main .content').hide(140)
      $(`.section.main .title2`).removeClass('active')
      $(`.section.main .title2#${id}`).addClass('active')
      $(`.section.main .${id}`).show(140)
    })
  
  }
  $(document).mouseup(function(e) 
  {
      var container = $(".customsidenav");

      // if the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0) 
      {
        sidenav.classList.remove("active");

      }
  });
});
      
