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
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var cherry;
var strawberry;
var apple;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/scifi_bg.png');
    this.load.image('ground', 'assets/new_platform3.jpg');
    this.load.image('cherry1', 'assets/cherry.png');
    this.load.image('strawberry1', 'assets/strawberry.png');
    this.load.image('apple1', 'assets/apple.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/little_man.png', { frameWidth: 31.5, frameHeight: 48 });
}

function create ()
{
    //  A simple background for our game
    this.add.image(530, 400, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(600, 800, 'ground').setScale(3).refreshBody();

    platforms.create(600, 10, 'ground').setScale(3).refreshBody();

    //  Now let's create some ledges
    platforms.create(700, 600, 'ground'); //bottom right
    platforms.create(50, 600, 'ground'); //bottom left
    platforms.create(400, 450, 'ground').setScale(0.75).refreshBody();
    platforms.create(50, 350, 'ground');
    platforms.create(700, 350, 'ground');
    platforms.create(400, 200, 'ground').setScale(0.75).refreshBody();

    // The player and its settings
    player = this.physics.add.sprite(100, 600, 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  create cherries
    cherry = this.physics.add.group({
        key: 'cherry1',
        repeat: 12,
        setXY: { x: 20, y: 0, stepX: 70 }
    });

    cherry.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });
    //  create strawberries
    strawberry = this.physics.add.group({
        key: 'strawberry1',
        repeat: 12,
        setXY: { x: 20, y:350, stepX: 70 }
    });

    strawberry.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });
    //  create apples
    apple = this.physics.add.group({
        key: 'apple1',
        repeat: 9,
        setXY: { x: 200, y: 600, stepX: 70 }
    });

    apple.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    bombs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(cherry, platforms);
    this.physics.add.collider(strawberry, platforms);
    this.physics.add.collider(apple, platforms);
    this.physics.add.collider(bombs, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, cherry, collectCherry, null, this);
    this.physics.add.overlap(player, strawberry, collectStrawberry, null, this);
    this.physics.add.overlap(player, apple, collectApple, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update ()
{
    if (gameOver)
    {
        return;
    }

    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}

function collectCherry (players, cherries)
{
    cherries.disableBody(true, true);

    //  Add and update the score
    score += 5;
    scoreText.setText('Score: ' + score);

    if (cherry.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        cherry.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (players.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }
}
function collectStrawberry (players, strawberries)
{
    strawberries.disableBody(true, true);

    //  Add and update the score
    score += 3;
    scoreText.setText('Score: ' + score);

    if (strawberry.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        strawberry.children.iterate(function (child) {

            child.enableBody(true, child.x, 350, true, true);

        });

        var x = (players.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }
}
function collectApple (players, apples)
{
    apples.disableBody(true, true);

    //  Add and update the score
    score += 1;
    scoreText.setText('Score: ' + score);

    if (apple.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        apple.children.iterate(function (child) {

            child.enableBody(true, child.x, 600, true, true);

        });

        var x = (players.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }
}
function hitBomb (players, bomb)
{
    this.physics.pause();

    players.setTint(0x3EA7EC);

    players.anims.play('turn');

    gameOver = true;
}

    

