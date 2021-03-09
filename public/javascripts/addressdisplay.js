$(document).ready(()=>{
    if($('#addressnr')){
      var i=0;
      $('#address-display').text(`${addresses[i].street}, ${addresses[i].city}, ${addresses[i].state == '' ? addresses[i].county : addresses[i].state}, ${addresses[i].country}; Zip: ${addresses[i].zip}`)
  
      $('#addressnr').change(()=>{
        i = $('#addressnr').val()
        $('#address-display').text(`${addresses[i].street}, ${addresses[i].city}, ${addresses[i].county}, ${addresses[i].country}; Zip: ${addresses[i].zip}`)
      })
    }
    
})