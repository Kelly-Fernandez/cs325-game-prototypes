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
var water;
let text;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image("tiles", "assets/maze_tiles.png");
    this.load.image("water1","assets/water.png");
    this.load.tilemapTiledJSON("map", "assets/mazetrial.json");
    this.load.spritesheet('dude', 'assets/little_man.png', { frameWidth: 31.5, frameHeight: 48 });
}

function create ()
{
    //  A simple background for our game

    const map = this.make.tilemap({key: "map"});

    const tileset = map.addTilesetImage("maze_tiles","tiles");

    var rng = Math.floor((Math.random() * 3) + 1);
    let worldLayer;

    const groundLayer = map.createStaticLayer("ground", tileset, 0, 0);
    const oasis = map.createStaticLayer("oasis", tileset, 0, 0);

    if (rng == 1){
        worldLayer = map.createStaticLayer("world1", tileset, 0, 0);
    }
    else if (rng == 2) {
        worldLayer = map.createStaticLayer("world2", tileset, 0, 0);
    }
    else {
        worldLayer = map.createStaticLayer("world3", tileset, 0, 0);
    }
    worldLayer.setCollisionByProperty({ collides: true });

    // The player and its settings
    player = this.physics.add.sprite(300, 900, 'dude');

    this.reset = this.input.keyboard.addKey('SPACE');

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

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    water = this.physics.add.group({
        key: 'water1',
        setXY: { x: 480, y: 480 }
    })

    //  The score
    scoreText = this.add.text(16, 1, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, worldLayer);


    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, water, collectWater, null, this);
}

function update ()
{
    if (gameOver)
    {
        let style = { font: "30px Tahoma", fill: "#3391CF", outline: "5px",align: "center" };
        text = this.add.text( this.cameras.main.centerX, this.cameras.main.centerY, "YOU FOUND THE OASIS\nPress SPACE to play again", style );
        text.setOrigin( 0.5, 0.0 );
    }

    if(this.reset.isDown){
        this.scene.restart();
        gameOver = false;
    }
    
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

        player.anims.play('down', true);
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(260);

        player.anims.play('up', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }
}

function collectWater (players, bottle)
{
    bottle.disableBody(true, true);

    //  Add and update the score
    score += 5;
    scoreText.setText('Score: ' + score);

    if (water.countActive(true) === 0)
    {
        this.physics.pause();
        players.anims.play('turn');
        gameOver = true;
    }
}


    

