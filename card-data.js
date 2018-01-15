//Enemy Objects
var enemy_ghoul = {
    name:"Ghoul",
    type:"enemy",
    image:"images/card-front_enemy_ghoul.png",
    hpAttack: 10,
    audio_attack: new Audio("audio/enemy_ghoul_attack.wav"),
    audio_destroyed: new Audio("audio/enemy_ghoul_destroyed.wav")
};
var enemy_protectron = {
    name:"Protectron",
    type:"enemy",
    image:"images/card-front_enemy_protectron.png",
    hpAttack: 15,
    audio_attack: new Audio("audio/enemy_protectron_attack.wav"),
    audio_destroyed: new Audio("audio/enemy_protectron_destroyed.wav")
};
var enemy_deathclaw = {
    name:"Deathclaw",
    type:"enemy",
    image:"images/card-front_enemy_deathclaw.png",
    hpAttack: 20,
    audio_attack: new Audio("audio/enemy_deathclaw_attack.wav"),
    audio_destroyed: new Audio("audio/enemy_deathclaw_destroyed.wav")
};
//Gear Objects
var gear_pistol = {
    name:"Pistol",
    type:"gear",
    image:"images/card-front_gear_pistol.png",
    damageResistance: 15,
    audio: new Audio("audio/gear_pistol.wav")
};
var gear_plasmaRifle = {
    name:"Plasma Rifle",
    type:"gear",
    image:"images/card-front_gear_plasma-rifle.png",
    damageResistance: 25,
    audio: new Audio("audio/gear_plasma-rifle.wav")
};
var gear_miniNuke = {
    name:"Mini Nuke",
    type:"gear",
    image:"images/card-front_gear_mini-nuke.png",
    damageResistance: 35,
    audio: new Audio("audio/gear_mini-nuke.wav")
};
//Aid Objects
var aid_nukaCola = {
    name:"Nuka Cola",
    type:"aid",
    image:"images/card-front_aid_nuka-cola.png",
    hpRecovery: 20,
    audio: new Audio("audio/aid_nuka-cola.wav")
};
var aid_radAway = {
    name:"RadAway",
    type:"aid",
    image:"images/card-front_aid_rad-away.png",
    hpRecovery: 30,
    audio: new Audio("audio/aid_rad-away.wav")
};
var aid_stimpak = {
    name:"Stimpak",
    type:"aid",
    image:"images/card-front_aid_stimpak.png",
    hpRecovery: 40,
    audio: new Audio("audio/aid_stimpak.wav")
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