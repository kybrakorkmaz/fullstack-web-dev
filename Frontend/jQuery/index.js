/*$(document).ready(function() {
    $("h1").css("color", "blue");
    $("h1").css("font-size", "50px");
}); if the scripts are in the head tag use this*/

/* to do look at manipulationg html css text attribute etc in jQuery and write to the readme file.*/
$("h1").click(function(){
    $("h1").css("color", "purple");
});
/*for (var i =0; i<5; i++){
    document.querySelectorAll("button")[i].addEventListener("click", function(){
        document.querySelector("h1").style.color="purple";
    });
}*/
$("input").keydown(function(event){
    var inputValue = event.key;
    $("h1").text(inputValue);
});
$("button").on("click", function(){
    /*$("h1").hide();
    $("h1").fadeOut();
    $("h1").fadeIn();
    $("h1").slideUp();
    $("h1").slideDown();*/
    $("h1").animate({opacity: 0.5});
});