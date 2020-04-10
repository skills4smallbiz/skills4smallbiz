/**
 * Load general website template
 * 
 * Fills navbar and head information.
 */

$(function(){
    $("#navbar").load("/templates/navbar.html"); 
    $('footer').load('/templates/footer.html');
});

$.get("/templates/head.html", function(data){
    $('head').prepend(data);
});
