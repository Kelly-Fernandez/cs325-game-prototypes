import "./phaser.js";

// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// The simplest class example: https://phaser.io/examples/v3/view/scenes/scene-from-es6-class

var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 850,
    height: 480,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var timer;
var timedEvent;
var text;

var gameOver = false;
var won = false;
var timesUp = false;
var rulesText;
var level = 0;
var car;
var finishLine;
let typeArray;
var correct;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/road.jpg');
    this.load.image('car','assets/car.png');
    this.load.image('line','assets/finish.png');
    this.load.audio('bgm', 'assets/music.mp3');
}

function create ()
{
    //background for game
    this.add.image(425, 240, 'sky');
    //play bgm
    this.music = this.sound.add('bgm', {volume: 0.04}); 
    this.music.play();
    //car
    car = this.physics.add.sprite(80, 400, 'car');
    //finish line
    finishLine = this.physics.add.sprite(840, 400, 'line');
    //when car overlap the finish line
    this.physics.add.overlap(car, finishLine, finished, null, this);
    //key for text prompt
    this.word = this.input.keyboard.addKey('ENTER');
    //array of words to be typed
    typeArray = ["around","work","how","world","real","fact","we","or","while","still","keep", "this","before", "when","seem","through","begin","course","same","help"];
    //console log
    console.log('create');  
    //20 seconds time limit
    this.initialTime = 20;
    timer = this.add.text(320, 100, 'Time: ' + formatTime(this.initialTime), {fontSize: '32px', fill: "#000000"});
    //Each 1000 ms call onEvent
    timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });
    //display rules
    rulesText = this.add.text(75, 175, "Press ENTER key and type the following word: \n                   " + typeArray[level], { fontSize: '28px', fill: '#000000' })
    //add reset button
    this.reset = this.input.keyboard.addKey('SPACE');

} 
function finished () {
    won = true;
    gameOver = true;
    timedEvent.destroy();
}


function typing (){
    var input = prompt("Type the following word: " + typeArray[level]);

    if(typeArray[level] == input) {
        level += 1;
        correct = true;
        if(level < 20) {
            rulesText.setText("Press ENTER key and type the following word: \n                   " + typeArray[level]);
        }
    }
}
function formatTime(seconds){

    // Minutes
    var minutes = Math.floor(seconds/60);
    // Seconds
    var partInSeconds = seconds%60;
    // Adds left zeros to seconds
    partInSeconds = partInSeconds.toString().padStart(2,'0');

    if(minutes <= 0 && partInSeconds <= 0) {
        timesUp = true;
        gameOver = true;
        return `0:00`;
    }

    // Returns formated time
    return `${minutes}:${partInSeconds}`;
}


function onEvent ()
{
    this.initialTime -= 1; // One second
    timer.setText('Time: ' + formatTime(this.initialTime));
}   


function update ()
{   
    if(gameOver == true) {
        this.physics.pause();
        if(won) {
            rulesText.destroy();
            text = this.add.text(165, 150, "YOU WON! Press SPACE to restart", { fontSize: '28px', fill: '#000000' });
        }
        if(timesUp) {
            rulesText.destroy();
            text = this.add.text(100, 150, "YOUR TIME IS UP! Press SPACE to restart", { fontSize: '28px', fill: '#000000' });
        }
    }
    if(this.word.isDown){
        if(level < 20 && timesUp == false) {
            typing(); 
        } 
        else {
            rulesText.destroy();
        }
        if(correct) 
        {
            car.setX(80 + level * 35);
            correct = false;
        } 
    }
    if(this.reset.isDown){
        this.scene.restart();
        this.music.stop();
        timesUp = false;
        won = false;
        gameOver = false;
        level = 0;
    }
}
