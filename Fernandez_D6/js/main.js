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
    width: 1012,
    height: 567,
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

var score = 0;
var gameOver = false;
var scoreText;
var questnum = 1;
let answerArray;
var correct = false;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ques1', 'assets/q1.jpg');
    this.load.image('ques2', 'assets/q2.jpg');
    this.load.image('ques3', 'assets/q3.jpg');
    this.load.image('ques4', 'assets/q4.jpg');
    this.load.image('ques5', 'assets/q5.jpg');
    this.load.image('ques6', 'assets/q6.jpg');
    this.load.image('ques7', 'assets/q7.jpg');
    this.load.image('ques8', 'assets/q8.jpg');
    this.load.image('ques9', 'assets/q9.jpg');
    this.load.image('ques10', 'assets/q10.jpg');
    this.load.image('ques11', 'assets/q11.jpg');
    this.load.image('button','assets/button.jpg');
}

function create ()
{
    //  A simple background for our game
    if(questnum == 1) {
        this.add.image(506, 285, 'ques1');
    }
    else if(questnum == 2) {
        this.add.image(506, 285, 'ques2');
    }
    else if(questnum == 3) {
        this.add.image(506, 285, 'ques3');
    }
    else if(questnum == 4) {
        this.add.image(506, 285, 'ques4');
    }
    else if(questnum == 5) {
        this.add.image(506, 285, 'ques5');
    }
    else if(questnum == 6) {
        this.add.image(506, 285, 'ques6');
    }
    else if(questnum == 7) {
        this.add.image(506, 285, 'ques7');
    }
    else if(questnum == 8) {
        this.add.image(506, 285, 'ques8');
    }
    else if(questnum == 9) {
        this.add.image(506, 285, 'ques9');
    }
    else if(questnum == 10) {
        this.add.image(506, 285, 'ques10');
    }
    else if(questnum == 11) {
        this.add.image(506, 285, 'ques11');
    }

    var button = this.add.sprite(500, 500, 'button').setInteractive();

    button.on('pointerdown', function (pointer) {

        answer();

    });

} 


function answer (){
    var input = prompt("What country does this flag belong to? (type all lowercase)");

    answerArray = ["russia", "italy", "uruguay", "thailand", "greece", "ghana","denmark", "panama", "south africa", "slovenia", "andorra"]

    if(questnum == 1) {
        if(answerArray[0] === input) {
            questnum+=1;
            correct = true;
        }
    }
    else if (questnum == 2) {
        if(answerArray[1] === input) {
            questnum+=1;
            correct = true;
        }
    }
    else if (questnum == 3) {
        if(answerArray[2] === input) {
            questnum+=1;
            correct = true;
        }
    }
    else if (questnum == 4) {
        if(answerArray[3] === input) {
            questnum+=1;
            correct = true;
        }
    }
    else if (questnum == 5) {
        if(answerArray[4] === input) {
            questnum+=1;
            correct = true;
        }
    }
    else if (questnum == 6) {
        if(answerArray[5] === input) {
            questnum+=1;
            correct = true;
        }
    }
    else if (questnum == 7) {
        if(answerArray[6] === input) {
            questnum+=1;
            correct = true;
        }
    }
    else if (questnum == 8) {
        if(answerArray[7] === input) {
            questnum+=1;
            correct = true;
        }
    }
    else if (questnum == 9) {
        if(answerArray[8] === input) {
            questnum+=1;
            correct = true;
        }
    }
    else if (questnum == 10) {
        if(answerArray[9] === input) {
            questnum+=1;
            correct = true;
        }
    }
    else if (questnum == 11) {
        if(answerArray[10] === input) {
            questnum = 1;
            correct = true;
        }
    }
}
 


function update ()
{   
    if(gameOver == true) {
        scoreText = this.add.text(330, 150, 'FINAL Score: ' + score, { fontSize: '32px', fill: '#FFFFFF' })
    }
    if (correct == true) {
        this.scene.restart();
        correct = false;
    }
}

