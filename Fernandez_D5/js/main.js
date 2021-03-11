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
    width: 900,
    height: 600,
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

var word;
var text;
var timer;
var timedEvent;

var score = 0;
var gameOver = false;
var scoreText;
let wordArray;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/scifi_bg.png');
    this.load.image('button','assets/button.jpg');
}

function create ()
{
    //  A simple background for our game
    this.add.image(530, 250, 'sky');

    var button = this.add.sprite(450, 350, 'button').setInteractive();

    button.on('pointerdown', function (pointer) {

        rhymes();

    });

    word = "blue";

    console.log('create');
    // 30 in seconds
    this.initialTime = 30;

    timer = this.add.text(32, 32, 'Countdown: ' + formatTime(this.initialTime));

    // Each 1000 ms call onEvent
    timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });

    let rules = { font: "30px Droid Sans", fill: "#FFFFFF", outline: "5px",align: "center" };
            text = this.add.text( this.cameras.main.centerX, this.cameras.main.centerY, "Click button and type 1-syllable words that rhyme with: " + word, rules );
            text.setOrigin(0.5, 1.4);

    scoreText = this.add.text(370, 425, 'Score: 0', { fontSize: '32px', fill: '#FFFFFF' })


} 


function rhymes (){
    var input = prompt("Type words that rhyme with: " + word, "");

    wordArray = ["beu", "bleu", "blew", "boo", "breaux", "brew", "brue", "cfmeu", 
        "chew", "chiu", "choo", "chou", "choux", "chu", "chuai", "ch tru", "clue", "coo", 
        "cooie", "cou", "coup", "coups", "creux", "crew", 
        "crewe", "cue", "dew", "do", "doo", "douwe", "drew", 
        "dru", "du", "due", "ewe", "few", "flew", "flu", "flue", "foo", "frew", "frueh", "fu", 
        "glew", "glue", "gnu", "goo", "graue", "grew", "grewe", "gu", "gue", 
        "gueux", "hew", "hewe", "hoo", "hoogh", "hou", "houx", "hsu", "hu", "hue", "hugh", "jew", "joo", 
        "ju", "jue", "jus", "kew", "khoo", "khuu", "klu", "knew", "koo", "krewe", "ku", "kyu", "leu", "lew", 
        "lieu", "lieue", "liu", "loo", "looie", "lou", "louw", "loux", "lu", "lue", "mew", "moo", "mooie", 
        "mu", "new", "nu", "ooh", "oooh", "ou", "peugh", "pew", "phew", "phu", "plew", "plue", "plugh", 
        "poo", "pooh", "pou", "prew", "pru", "prue", "prugh", "pshew", "pu", "pugh", "q", "que", 
        "queue", "rew", "rhew", "rhue", "rioux", "roux", "ru", "rue", 
        "schewe", "schmoo", "schoo", "schou", "schue", "schuh", "screw", "shew", "shiu", "shluh", 
        "shmoo", "shoe", "shoo", "shoo-in", "shrew", "shu", "shue", "siew", "sioux", "skew", "slew", 
        "soo", "spew", "sprew", "sprue", "stew", "strew", "stu", "stuewe", "su", "sue", "tew", "thew", 
        "threw", "through", "thru", "thuy", "to", "too", "treu", "trew", "trewe", "trieu", "true", "truhe", 
        "tsu", "tu", "tue", "two", "u","uwe", "view", "vous", "vu", "vue", "whew", "who", "whoo", "woo", 
        "wu", "xu", "xue", "xview", "yew", "yoo", "you", "yu", "yue", "zhou", "zhu", "zoo", "zue"];

    if(wordArray.includes(input)) {
        score += 1; 
        scoreText.setText('Score: ' + score);
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
        gameOver = true;
        return `0:00`;
    }

    // Returns formated time
    return `${minutes}:${partInSeconds}`;
}


function onEvent ()
{
    this.initialTime -= 1; // One second
    timer.setText('Countdown: ' + formatTime(this.initialTime));
}   


function update ()
{   
    if(gameOver == true) {
        scoreText = this.add.text(330, 475, 'FINAL Score: 0', { fontSize: '32px', fill: '#FFFFFF' })
    }
}

