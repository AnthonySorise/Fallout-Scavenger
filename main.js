$(document).ready(initializeApp);
function initializeApp(){
    distributeCardFronts();
    applyClickHandlers()
}

function applyClickHandlers(){
    $(".cardContainer").on("click", handleClick);
    $("#resetGameButton").on("click", resetGame);
}

//global variables
var firstCardClicked = null;
var secondCardClicked = null;
var matchCounter = 0;
var canClick = true;
var health = 100;
var effectMessages = ["", "", "", "", ""];
var damageReduction = 0;

//stats
var timesPlayed = 0;
var numberOfTries = 0;
var accuracy = 0;

//Enemy Objects
var enemy_ghoul = {
    name:"Ghoul",
    type:"enemy",
    image:"images/card-front_enemy_ghoul.png",
    hpAttack: 10,
    audio_attack: "audio/enemy_ghoul_attack.wav",
    audio_destroyed: "audio/enemy_ghoul_destroyed.wav"
};
var enemy_protectron = {
    name:"Protectron",
    type:"enemy",
    image:"images/card-front_enemy_protectron.png",
    hpAttack: 15,
    audio_attack: "audio/enemy_protectron_attack.wav",
    audio_destroyed: "audio/enemy_protectron_destroyed.wav"
};
var enemy_deathclaw = {
    name:"Deathclaw",
    type:"enemy",
    image:"images/card-front_enemy_deathclaw.png",
    hpAttack: 20,
    audio_attack: "audio/enemy_deathclaw_attack.wav",
    audio_destroyed: "audio/enemy_deathclaw_destroyed.wav"
};
//Gear Objects
var gear_pistol = {
    name:"Pistol",
    type:"gear",
    image:"images/card-front_gear_pistol.png",
    damageResistance: 15,
    audio: "audio/gear_pistol.wav"
};
var gear_plasmaRifle = {
    name:"Plasma Rifle",
    type:"gear",
    image:"images/card-front_gear_plasma-rifle.png",
    damageResistance: 25,
    audio: "audio/gear_plasmaRifle.wav"
};
var gear_miniNuke = {
    name:"Mini Nuke",
    type:"gear",
    image:"images/card-front_gear_mini-nuke.png",
    damageResistance: 35,
    audio: "audio/gear_miniNuke.wav"
};
//Aid Objects
var aid_nukaCola = {
    name:"Nuka Cola",
    type:"aid",
    image:"images/card-front_aid_nuka-cola.png",
    hpRecovery: 20,
    audio: "audio/aid_nukaCola.wav"
};
var aid_radAway = {
    name:"RadAway",
    type:"aid",
    image:"images/card-front_aid_rad-away.png",
    hpRecovery: 30,
    audio: "audio/aid_radAway.wav"
};
var aid_stimpak = {
    name:"Stimpak",
    type:"aid",
    image:"images/card-front_aid_stimpak.png",
    hpRecovery: 40,
    audio: "audio/aid_stimpak.wav"
};
var cardObjects = [
    enemy_ghoul,
    enemy_protectron,
    enemy_deathclaw,
    gear_pistol,
    gear_plasmaRifle,
    gear_miniNuke,
    aid_nukaCola,
    aid_radAway,
    aid_stimpak];

function getCardObject(card){
    var cardImgURL = $(card).find(".frontCard").css("background-image");
    for(var i = 0; i < cardObjects.length; i++) {
        if (cardImgURL.includes(cardObjects[i].image)) {
            return cardObjects[i];
        }
    }
}

function distributeCardFronts(){
    var cardFronts = [];
    for(var i = 0; i < cardObjects.length; i++){
        cardFronts.push(cardObjects[i].image)
    }
    //Create an array with two copies of each index for cardFronts
    var indexArray = [];
    for(var i = 0; i < cardFronts.length; i++){
        indexArray.push(i);
        indexArray.push(i);
    }
    //Randomize the order of indexes in indexArray
    var randomizedIndexArray = [];
    while(indexArray.length > 0){
        var randomIndexForIndexArray = parseInt(Math.random() * indexArray.length);
        randomizedIndexArray.push(indexArray.splice(randomIndexForIndexArray, 1));
    }
    //Set card fronts to card containers using indexes from randomizedIndexArray
    var cardContainerArray = $(".cardContainer");
    for(var i = 0; i < randomizedIndexArray.length; i++){
        $(cardContainerArray[i]).find(".frontCard").css("background-image", "url(" + cardFronts[randomizedIndexArray[i]] + ")");
    }
}

function handleClick(){
    console.log(this);
    if(canClick === true && this!==firstCardClicked && $(this).hasClass("flippedCard") === false) {
        audio_cardFlip();
        $(this).addClass("flippedCard");
        updateCardDetails(this);
        if (firstCardClicked === null) {
            firstCardClicked = this;
        }
        else {
            secondCardClicked = this;
            compareCardPair();
            //update stats
            numberOfTries += 1;
            $("#statNumTries").text("Turns: "+ numberOfTries);
            accuracy = parseInt(100* (matchCounter / numberOfTries));
            $("#statAccuracy").text("Accuracy: " + accuracy + "%");
        }
    }
}

function compareCardPair(){
    canClick = false;
    //if they have the same frontCard image
    if (getCardObject(firstCardClicked).image === getCardObject(secondCardClicked).image) {
        audio_cardMatchMade();
        matchCounter += 1;
        // logEffect("Match made!");
        var matchCardType = getCardObject(firstCardClicked).type;
        switch(matchCardType) {
            case "enemy":
                audio_enemyDestroyed(firstCardClicked);
                effect_enemyDestroyed(firstCardClicked);
                break;
            case "gear":
                audio_gearAcquired(firstCardClicked);
                effect_getGear(firstCardClicked);
                break;
            case "aid":
                audio_aidAcquired(firstCardClicked);
                effect_useAid(firstCardClicked);
                break;
        }
        $(firstCardClicked).find(".backCard").fadeOut(500);
        $(secondCardClicked).find(".backCard").fadeOut(500);
        setTimeout(function () {
            $(firstCardClicked).find(".frontCard").fadeOut(500);
            $(secondCardClicked).find(".frontCard").fadeOut(500);
            firstCardClicked = null;
            secondCardClicked = null;
            canClick = true;
            checkWin();

        }, 500);
    }
    else {  //if they don't match
        if(getCardObject(firstCardClicked).type === "enemy"){
            if(getCardObject(secondCardClicked).type === "enemy"){
                audio_enemyAttack(firstCardClicked);
                audio_enemyAttack(secondCardClicked);
                effect_enemyAttack(firstCardClicked, secondCardClicked);
            }
            else{
                audio_enemyAttack(firstCardClicked);
                effect_enemyAttack(firstCardClicked);
            }
        }
        else if(getCardObject(secondCardClicked).type === "enemy"){
            audio_enemyAttack(secondCardClicked);
            effect_enemyAttack(secondCardClicked)
        }
        else{
            audio_radiation();
            effect_radiationPoisoning();
        }
        setTimeout(function () {
            $(firstCardClicked).removeClass("flippedCard");
            $(secondCardClicked).removeClass("flippedCard");
            firstCardClicked = null;
            secondCardClicked = null;
            if(health > 0) {
                canClick = true;
            }
        }, 750);
    }
}

function updateCardDetails(card){
    $("#cardName").text(getCardObject(card).name);
    var cardEffectText1 = "On match:";
    var cardEffectText2 = "";
    if(getCardObject(card).type === "enemy"){
        cardEffectText1 = "On failed match:";
        cardEffectText2 = "-" + getCardObject(card).hpAttack + " HP";
    }
    else if(getCardObject(card).type === "gear"){
        cardEffectText2 = "+" + getCardObject(card).damageResistance + "% DR"
    }
    else if(getCardObject(card).type === "aid"){
        cardEffectText2 = "+" + getCardObject(card).hpRecovery + " HP";
    }
    $("#cardEffect1").text(cardEffectText1);
    $("#cardEffect2").text(cardEffectText2);
}

function gainDamageReduction(DRgain){
    var newDR = damageReduction + DRgain;
    var increaseDR = setInterval(function () {
        if(damageReduction === newDR){
            clearInterval(increaseDR)
        }
        if(damageReduction < newDR) {    //redundant, but necessary (it overshoots otherwise)
            damageReduction += 1;
            $("#damageReduction").text(damageReduction + "%");
        }
    }, 45);
}

function gainHealth(healthGained){
    var oldHealth = health;
    var newHealth = oldHealth + healthGained;
    if( newHealth > 100){
        newHealth = 100;
    }
    var increaseHealth = setInterval(function () {
        if(oldHealth === newHealth || oldHealth === 100){
            clearInterval(increaseHealth)
        }
        if(oldHealth < newHealth && oldHealth < 100) {
            oldHealth += 1;
            $("#health").text(oldHealth + " / 100");
        }
        updateHealthImage();
    }, 45);

    health = newHealth;
}

function loseHealth(damageTaken){
    var oldHealth = health;
    var newHealth = health - damageTaken;
    if(newHealth < 0){
        newHealth = 0;
    }
    var decreaseHealth = setInterval(function () {
        if(oldHealth === newHealth || oldHealth === 0){
            clearInterval(decreaseHealth)
        }
        if(oldHealth > newHealth && oldHealth !== 0) {
            oldHealth -= 1;
            $("#health").text(oldHealth + " / 100");
        }
        updateHealthImage();
    }, 45);
    health = newHealth;
}

function updateHealthImage(){
    var imagePath = "";
    if(health >= 75){
        imagePath = "images/health_100.png";
    }
    else if(health >= 50 && health <75){
        imagePath = "images/health_075.png";
    }
    else if(health >= 25 && health <50){
        imagePath = "images/health_050.png";
    }
    else if(health > 0 && health < 25){
        imagePath = "images/health_025.png";
    }
    else{
        imagePath = "images/health_000.png";
    }
    $("#healthImgContainer").css("background-image", "url(" + imagePath + ")");
}

function logEffect(effectMessage){
    var newEffectMessage = "Turn " + (numberOfTries + 1) +": " + effectMessage;
    effectMessages.push(newEffectMessage);
    updateEffectList();
}

function effect_radiationPoisoning(){
    loseHealth(5);
    logEffect("-5 HP from Radiation Poisoning!");
    checkLose();
}

function effect_enemyAttack(card1, card2){
    var totalDamage = 0;
    var damageTakenCard1 = effect_useGear(getCardObject(card1).hpAttack);
    logEffect("-" + damageTakenCard1 + " HP from " + getCardObject(card1).name + " attack!");
    totalDamage += damageTakenCard1;
    if(card2 !== undefined){
        var damageTakenCard2 = effect_useGear(getCardObject(card2).hpAttack);
        logEffect("-" + damageTakenCard2 + " HP from " + getCardObject(card2).name + " attack!");
        totalDamage +=damageTakenCard2;
    }
    loseHealth(totalDamage);
    checkLose();
}

function effect_enemyDestroyed(card){
    logEffect(getCardObject(card).name + " destroyed!")
}

function effect_getGear(card){
    gainDamageReduction(getCardObject(card).damageResistance);
    logEffect("+" + getCardObject(card).damageResistance + "% DR gained from " + getCardObject(card).name + "!")
}

function effect_useGear(incomingDamage){
    var origDamageValue = incomingDamage;
    incomingDamage = Math.round(incomingDamage * (100 - damageReduction) * 0.01);
    if(damageReduction !== 0) {
        logEffect(origDamageValue - incomingDamage + " damage resisted!")
    }
    return incomingDamage
}

function effect_useAid(card){
    gainHealth(getCardObject(card).hpRecovery);
    logEffect("+" + getCardObject(card).hpRecovery + " HP gained from " + getCardObject(card).name + "!")
}

function updateEffectList(){
    for(var i = 1; i <=5; i++){
        console.log(effectMessages[effectMessages.length-i] !== "")
        if(effectMessages[effectMessages.length-i] !== ""){
            let li = "#effect"+i;
            $(li).text(effectMessages[effectMessages.length-i]).css("list-style", "square");
        }
    }
}

function checkWin(){
    if(matchCounter === 9){
        audio_win();
        logEffect("You Won!");
    }
}

function checkLose(){
    if(health <= 0){
        audio_lose();
        logEffect("You Lose!");
        canClick = false;
    }
}

function resetGame(){
    audio_restart();
    distributeCardFronts();

    //bring cards back and reset position
    $(".cardContainer").css("display", "none");     //Hide before flip back
    $(".cardContainer").find(".frontCard").css("display", "none");  //Double Hide (firefox support)
    $(".cardContainer").removeClass("flippedCard");//Flip back
    $(".frontCard").fadeIn(1);//Fade back in
    $(".backCard").fadeIn(1);//Fade back in
    $(".cardContainer").find(".frontCard").css("display", "absolute");  //UnHide
    $(".cardContainer").css("display", "block");    //UnHide

    //reset Globals
    firstCardClicked = null;
    secondCardClicked = null;
    secondCardClicked = null;
    matchCounter = 0;
    canClick = true;

    //reset Logs
    effectMessages = ["", "", "", "", ""];
    $("#effect1").text("").css("list-style", "none");
    $("#effect2").text("").css("list-style", "none");
    $("#effect3").text("").css("list-style", "none");
    $("#effect4").text("").css("list-style", "none");
    $("#effect5").text("").css("list-style", "none");

    //reset CardInfo
    $("#cardName").text("");
    $("#cardEffect1").text("");
    $("#cardEffect2").text("");

    //reset Stats
    timesPlayed+=1;
    $("#statTimesPlayed").text("Games: " + timesPlayed);
    numberOfTries = 0;
    $("#statNumTries").text("Turns:");
    $("#statAccuracy").text("Accuracy: ");

    //reset health and DR
    health = 100;
    $("#health").text(health + " / 100");
    $("#healthImgContainer").css("background-image", "url(images/health_100.png)");

    damageReduction = 0;
    $("#damageReduction").text("0%");

    setTimeout(function(){ //this is here in the event of a game reset during the setIntervals in gainHealth()/loseHealth()/gainDamageReduction() - which results in wrong information being displayed in the UI
        $("#health").text(health + " / 100");
        $("#healthImgContainer").css("background-image", "url(images/health_100.png)");
    }, 750);
}

//AUDIO
function audio_cardFlip(){
    var audio = new Audio("audio/flip.wav");
    audio.play();
}
function audio_cardMatchMade(){
    var audio = new Audio("audio/match.wav");
    audio.play();
}
function audio_enemyAttack(card){
    var audio = new Audio(getCardObject(card).audio_attack);
    audio.play();
}
function audio_enemyDestroyed(card){
    var audio = new Audio(getCardObject(card).audio_destroyed);
    audio.play();
}
function audio_gearAcquired(card){
    var audio = new Audio(getCardObject(card).audio);
    audio.play();
}
function audio_aidAcquired(card){
    var audio = new Audio(getCardObject(card).audio);
    audio.play();
}
function audio_radiation(){
    var radiationSounds = ["audio/radiation01.wav", "audio/radiation02.wav", "audio/radiation03.wav"];
    var randomIndex = Math.floor(Math.random()*(radiationSounds.length));
    var audio = new Audio(radiationSounds[randomIndex]);
    audio.play();
}
function audio_restart(){
    var audio = new Audio("audio/restart.wav");
    audio.play();
}
function audio_win(){
    var audio = new Audio("audio/win.wav");
    audio.play();
}
function audio_lose(){
    var audio = new Audio("audio/lose.wav");
    audio.play();
}