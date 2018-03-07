//Global Audio Objects
var audio_cardFlip = null;
var audio_cardFlip_dup = null;
var audio_cardMatchMade= null;
var audioArray_radiation= [];
var audio_restart= null;
var audio_win= null;
var audio_lose= null;
//Other Audio Objects stored in cardObjects in card-data.js

$(document).ready(function(){
    audio_cardFlip = new Audio("audio/flip.wav");
    audio_cardFlip_dup = new Audio("audio/flip.wav");
    audio_cardMatchMade= new Audio("audio/match.wav");
    var audio_radiation01 = new Audio("audio/radiation01.wav");
    var audio_radiation02 = new Audio("audio/radiation02.wav");
    var audio_radiation03 = new Audio("audio/radiation03.wav");
    audioArray_radiation.push(audio_radiation01, audio_radiation02, audio_radiation03);
    audio_restart= new Audio("audio/restart.wav");
    audio_win= new Audio("audio/win.wav");
    audio_lose= new Audio("audio/lose.wav");
});

function AudioHandler(){
    this.cardFlip = function(){
        if(audio_cardFlip.paused){
            audio_cardFlip.play();
        }
        else{
            audio_cardFlip_dup.play();
        }
    };
    this.cardMatchMade = function(){
        audio_cardMatchMade.play();
    };
    this.enemyAttack = function(card){
        if(getCardObject(card).audio_attack.paused){
            getCardObject(card).audio_attack.play();
        }
        else{
            getCardObject(card).audio_attack_dup.play();
        }
    };
    this.enemyDestroyed = function(card){
        getCardObject(card).audio_destroyed.play();
    };
    this.gearAcquired = function(card){
        getCardObject(card).audio.play();
    };
    this.aidAcquired = function(card){
        getCardObject(card).audio.play();
    };
    this.radiation = function(){
        var randomIndex = Math.floor(Math.random()*(audioArray_radiation.length));
        if(!audioArray_radiation[randomIndex].paused){
            if(randomIndex - 1 >= 0){
                randomIndex-= 1;
            }
            else{
                randomIndex+=1;
            }
        }
        audioArray_radiation[randomIndex].play();
    };
    this.restart = function(){
        audio_restart.pause();
        audio_restart.currentTime = 0;
        audio_restart.play();
    };
    this.win = function(){
        audio_win.play();
    };
    this.lose = function(){
        audio_lose.play();
    }
}