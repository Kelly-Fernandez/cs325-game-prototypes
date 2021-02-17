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
    width: 960,
    height: 960,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player;
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
    this.load.image("tiles", "assets/maze_tiles.png");
    this.load.tilemapTiledJSON("map", "assets/mazetrial.json");
    this.load.spritesheet('dude', 'assets/little_man.png', { frameWidth: 31.5, frameHeight: 48 });
}

function create ()
{
    //  A simple background for our game

    const map = this.make.tilemap({key: "map"});

    const tileset = map.addTilesetImage("maze_tiles","tiles");

    const groundLayer = map.createStaticLayer("ground", tileset, 0, 0);
    const oasis = map.createStaticLayer("oasis", tileset, 0, 0);
    const worldLayer = map.createStaticLayer("world", tileset, 0, 0);

    worldLayer.setCollisionByProperty({ collides: true });

    // The player and its settings
    player = this.physics.add.sprite(300, 900, 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    //player.setBounce(0.2);
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

    bombs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 1, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, worldLayer);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, cherry, collectCherry, null, this);
    this.physics.add.overlap(player, strawberry, collectStrawberry, null, this);
    this.physics.add.overlap(player, apple, collectApple, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update ()
{
    player.body.setVelocity(0);

    //horizontal movement
    if (cursors.left.isDown)
    {
        player.setVelocityX(-260);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(260);

        player.anims.play('right', true);
    }
    
    //vertical movement
    else if (cursors.up.isDown)
    {
        player.setVelocityY(-260);
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(260);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
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

    

