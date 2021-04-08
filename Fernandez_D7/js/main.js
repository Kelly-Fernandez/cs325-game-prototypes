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

var gameOver = false;
var questnum = 0;
var lives = 5;
var livesText;
var correct = false;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('intro', 'assets/q0.jpg');
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
    this.load.image('finale', 'assets/q12.jpg');
}

function create ()
{
    if(questnum == 0) {
        this.add.image(506, 285, 'intro');

        this.clickButton1 = this.add.text(425, 300, 'START', { font: "48px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerC();
        });
    }
    else if(questnum == 1) {
        this.add.image(506, 285, 'ques1');

        this.clickButton1 = this.add.text(175, 400, 'GERMANY', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerW();
        });
        this.clickButton2 = this.add.text(450, 400, 'RUSSIA', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerC();
        });
        this.clickButton3 = this.add.text(725, 400, 'ITALY', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerW();
        });
    }
    else if(questnum == 2) {
        this.add.image(506, 285, 'ques2');

        this.clickButton1 = this.add.text(175, 400, 'MEXICO', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerW();
        });
        this.clickButton2 = this.add.text(450, 400, 'FRANCE', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerW();
        });
        this.clickButton3 = this.add.text(725, 400, 'ITALY', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerC();
        });
    }
    else if(questnum == 3) {
        this.add.image(506, 285, 'ques3');
        this.clickButton1 = this.add.text(175, 400, 'CHILE', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerW();
        });
        this.clickButton2 = this.add.text(425, 400, 'URUGUAY', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerC();
        });
        this.clickButton3 = this.add.text(725, 400, 'PERU', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerW();
        });
    }
    else if(questnum == 4) {
        this.add.image(506, 285, 'ques4');
        this.clickButton1 = this.add.text(175, 400, 'THAILAND', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerC();
        });
        this.clickButton2 = this.add.text(450, 400, 'MALAYSIA', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerW();
        });
        this.clickButton3 = this.add.text(725, 400, 'INDONESIA', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerW();
        });
    }
    else if(questnum == 5) {
        this.add.image(506, 285, 'ques5');
        this.clickButton1 = this.add.text(175, 400, 'IRELAND', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerW();
        });
        this.clickButton2 = this.add.text(450, 400, 'GREECE', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerC();
        });
        this.clickButton3 = this.add.text(725, 400, 'PORTUGAL', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerW();
        });
    }
    else if(questnum == 6) {
        this.add.image(506, 285, 'ques6');
        this.clickButton1 = this.add.text(175, 400, 'JAMAICA', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerW();
        });
        this.clickButton2 = this.add.text(450, 400, 'EGYPT', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerW();
        });
        this.clickButton3 = this.add.text(725, 400, 'GHANA', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerC();
        });
    }
    else if(questnum == 7) {
        this.add.image(506, 285, 'ques7');
        this.clickButton1 = this.add.text(175, 400, 'DENMARK', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerC();
        });
        this.clickButton2 = this.add.text(450, 400, 'NORWAY', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerW();
        });
        this.clickButton3 = this.add.text(725, 400, 'FINLAND', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerW();
        });
    }
    else if(questnum == 8) {
        this.add.image(506, 285, 'ques8');
        this.clickButton1 = this.add.text(175, 400, 'PANAMA', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerC();
        });
        this.clickButton2 = this.add.text(425, 400, 'PARAGUAY', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerW();
        });
        this.clickButton3 = this.add.text(725, 400, 'PERU', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerW();
        });
    }
    else if(questnum == 9) {
        this.add.image(506, 285, 'ques9');
        this.clickButton1 = this.add.text(175, 400, 'MALI', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerW();
        });
        this.clickButton2 = this.add.text(410, 400, 'SOUTH AFRICA', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerC();
        });
        this.clickButton3 = this.add.text(725, 400, 'NIGERIA', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerW();
        });
    }
    else if(questnum == 10) {
        this.add.image(506, 285, 'ques10');
        this.clickButton1 = this.add.text(175, 400, 'SLOVENIA', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerC();
        });
        this.clickButton2 = this.add.text(450, 400, 'CROATIA', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerW();
        });
        this.clickButton3 = this.add.text(725, 400, 'SLOVAKIA', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerW();
        });
    }
    else if(questnum == 11) {
        this.add.image(506, 285, 'ques11');
        this.clickButton1 = this.add.text(175, 400, 'MACEDONIA', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerW();
        });
        this.clickButton2 = this.add.text(450, 400, 'MALTA', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerW();
        });
        this.clickButton3 = this.add.text(725, 400, 'ANDORRA', { font: "30px Droid Sans", fill: '#FFF' })
        .setInteractive({useHandCursor: true})
        .on('pointerup', () => {
            answerC();
        });
    }
    else {
        this.add.image(506, 285, 'finale')
    }

    this.reset = this.input.keyboard.addKey('SPACE');

    livesText = this.add.text(450,500, 'Lives: ' + lives, { font: "30px Droid Sans", fill: '#FFF' })
} 

function answerC() {
    questnum++;
    correct = true;
}
function answerW() {
    lives--;
    livesText.setText("Lives: " + lives);
    if(lives == 0) {
        gameOver = true;
    }
}

function update ()
{   
    if(gameOver == true) {
        this.add.text(10, 300, 'GAME OVER Press SPACE to restart', { font: "64px Droid Sans", fill: '#FFF' })
    }
    if (correct == true) {
        this.scene.restart();
        correct = false;
    }
    if(this.reset.isDown){
        gameOver = false;
        questnum = 0;
        lives = 5;
        this.scene.restart();
    }
}

