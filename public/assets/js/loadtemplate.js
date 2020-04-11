/**
 * Load general website template
 * 
 * Fills navbar and head information.
 */
$.get("/templates/head.html", function(data){
    $('head').prepend(data);
});

 $(function(){
    $("#navbar").load("/templates/navbar.html"); 
    $('footer').load('/templates/footer.html');
});


