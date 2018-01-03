function AudioHandler(){
    this.cardFlip = function(){
        var audio = new Audio("audio/flip.wav");
        audio.play();
    };
    this.cardMatchMade = function(){
        var audio = new Audio("audio/match.wav");
        audio.play();
    };
    this.enemyAttack = function(card){
        var audio = new Audio(cardObjectData.getCardInfo(card).audio_attack);
        audio.play();
    };
    this.enemyDestroyed = function(card){
        var audio = new Audio(cardObjectData.getCardInfo(card).audio_destroyed);
        audio.play();
    };
    this.gearAcquired = function(card){
        var audio = new Audio(cardObjectData.getCardInfo(card).audio);
        audio.play();
    };
    this.aidAcquired = function(card){
        var audio = new Audio(cardObjectData.getCardInfo(card).audio);
        audio.play();
    };
    this.radiation = function(){
        var radiationSounds = ["audio/radiation01.wav", "audio/radiation02.wav", "audio/radiation03.wav"];
        var randomSoundIndex = Math.floor(Math.random()*(radiationSounds.length));
        var audio = new Audio(radiationSounds[randomSoundIndex]);
        audio.play();
    };
    this.restart = function(){
        var audio = new Audio("audio/restart.wav");
        audio.play();
    };
    this.win = function(){
        var audio = new Audio("audio/win.wav");
        audio.play();
    };
    this.lose = function(){
        var audio = new Audio("audio/lose.wav");
        audio.play();
    }
}