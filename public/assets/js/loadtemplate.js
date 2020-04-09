/**
 * Load general website template
 * 
 * Fills navbar and head information.
 */

$(function(){
    $("#navbar").load("/templates/navbar.html"); 
    
    $.get("/templates/head.html", function(data){
        $('head').prepend(data);
    });

    $('footer').load('/templates/footer.html');
});