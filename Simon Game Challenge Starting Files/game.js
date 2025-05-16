var gamePattern = [];
var userClickedPattern=[];
var buttonColors = ["red", "blue", "green", "yellow"];
var isKeyUP = false;
var level = 0;
addEventListener('keyup', (event) => {
    if(isKeyUP === false){
        isKeyUP = true;
        $("h1").text("Level "+level);
        nextSequence();
    }
});
$(".btn").click(function () { 
    var userChosenColor = $(this).attr("id");
    userClickedPattern.push(userChosenColor);   
    playSound(userChosenColor);
    animatePress(userChosenColor);
    checkAnswer(userClickedPattern.length-1);
});
function nextSequence(){
    userClickedPattern=[];
    var randomNumber = Math.floor(Math.random()* 4);
    var randomChosenColor = buttonColors[randomNumber];
    gamePattern.push(randomChosenColor);
    $("#" + randomChosenColor).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColor);
    level++;
    $("h1").text("level "+level);
}

function playSound(name){
    var btnAudio = new Audio("sounds/" + name + ".mp3");
    btnAudio.play();
}

function animatePress(currentColor){
    var currentBtn = "#"+currentColor;
    $(currentBtn).addClass("pressed");
    setTimeout(function() {
        $(currentBtn).removeClass("pressed");
    }, 100);  
}
function checkAnswer(checkAns){
    if(gamePattern[checkAns] === userClickedPattern[checkAns]){
        console.log("success");
        if(gamePattern.length === userClickedPattern.length){
            setTimeout(function() {
                nextSequence();
            }, 1000);
        }
    }else{
        playSound("wrong");
        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 200);
        $("h1").text("Game Over! Press Any Key to Restart");
        startOver();
        
    } 
}

function startOver(){
    level = 0;
    gamePattern=[];
    isKeyUP=false;
    $("h1").text("Press A Key to Start");
}