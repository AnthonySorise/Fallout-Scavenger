$(document).ready(initializeApp);

function initializeApp(){
    distributeCardFronts()
    applyClickHandlers()
}

//global variables
var firstCardClicked = null;
var secondCardClicked = null;
var matchCounter = 0;
var canClick = true;

//stats
var timesPlayed = 0;
var numberOfTries = 0;
var accuracy = 0;

function distributeCardFronts(){
    var cardFronts = [
        "images/cardFront_aid_nukaCola.png",
        "images/cardFront_aid_radAway.png",
        "images/cardFront_aid_stimpak.png",
        "images/cardFront_enemy_deathclaw.png",
        "images/cardFront_enemy_ghoul.png",
        "images/cardFront_enemy_protectron.png",
        "images/cardFront_gear_laser.png",
        "images/cardFront_gear_miniNuke.png",
        "images/cardFront_gear_pistol.png"];

    //Create an array with two copies of each index for cardFronts
    var indexArray = [];
    for(var i = 0; i < cardFronts.length; i++){
        indexArray.push(i);
        indexArray.push(i);
    }

    //Randomize the order of indexes in indexArray
    var randomizedIndexArray = [];
    var indexArrayLength = indexArray.length;
    for(var i = 0; i < indexArrayLength; i++){
        var randomIndexForIndexArray = parseInt(Math.random() * indexArray.length);
        randomizedIndexArray.push(indexArray.splice(randomIndexForIndexArray, 1));
    }
    //Set card fronts to card containers using indexes from randomizedIndexArray
    var cardContainerArray = $(".cardContainer");
    for(var i = 0; i < randomizedIndexArray.length; i++){
        $(cardContainerArray[i]).find(".frontCard").css("background-image", "url(" + cardFronts[randomizedIndexArray[i]] + ")");
    }
}

function applyClickHandlers(){
    $(".cardContainer").on("click", handleClick);
    $("#resetGameButton").on("click", resetGame);
}

function handleClick(){
    if(canClick === true && this!==firstCardClicked) {
        $(this).find(".backCard").addClass("flippedCard");
        if (firstCardClicked === null) {
            firstCardClicked = this;
        }
        else {
            secondCardClicked = this;
            //if they have the same background image
            if ($(firstCardClicked).find(".frontCard").css("background-image") === $(secondCardClicked).find(".frontCard").css("background-image")) {
                $(firstCardClicked).find(".frontCard").fadeOut(750);
                $(secondCardClicked).find(".frontCard").fadeOut(750);
                matchCounter += 1;
                firstCardClicked = null;
                secondCardClicked = null;
                checkWin();
            }
            else {
                canClick = false;
                setTimeout(function () {
                    $(firstCardClicked).find(".backCard").removeClass("flippedCard");
                    $(secondCardClicked).find(".backCard").removeClass("flippedCard");
                    firstCardClicked = null;
                    secondCardClicked = null;
                    canClick = true;
                }, 500);
            }
            //update stats
            numberOfTries += 1;
            $("#statNumTries").text("Number of tries: "+ numberOfTries);
            accuracy = parseInt(100* (matchCounter / numberOfTries));
            $("#statAccuracy").text("Accuracy: " + accuracy + "%");
        }
    }
}

function checkWin(){
    if(matchCounter === 9){
        var winMessage = $("<h2>").text("YOU WIN!").attr("id", "winMessage");
        $("#gameInfo").append(winMessage);
    }
}

function resetGame(){
    distributeCardFronts();
    //bring cards back and reset position
    $(".frontCard").fadeIn(1);
    $(".backCard").removeClass("flippedCard");

    //reset Globals
    firstCardClicked = null;
    secondCardClicked = null;
    matchCounter = 0;
    canClick = true;
    $("#winMessage").remove();
    //reset Stats
    timesPlayed+=1;
    $("#statTimesPlayed").text("Times played: " + timesPlayed);
    numberOfTries = 0;
    $("#statNumTries").text("Number of tries: 0");
    $("#statAccuracy").text("Accuracy: ");
}