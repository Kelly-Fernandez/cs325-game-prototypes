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
var level = 1;
var gameOver = false;
var scoreText;
var music;
var hydration = 100;
var hydraText;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image("tiles", "assets/maze_tiles.png");
    this.load.image("water1","assets/water.png");
    this.load.tilemapTiledJSON("map", "assets/mazetrial.json");
    this.load.spritesheet('dude', 'assets/little_man.png', { frameWidth: 31.5, frameHeight: 48 });
    this.load.audio('bgm', 'assets/moonlight-beach.mp3');
}

function create ()
{
    //  A simple background for our game

    const map = this.make.tilemap({key: "map"});

    const tileset = map.addTilesetImage("maze_tiles","tiles");

    this.music = this.sound.add('bgm', {volume: 0.10}); 
    this.music.play();


    let worldLayer;

    const groundLayer = map.createStaticLayer("ground", tileset, 0, 0);
    const oasis = map.createStaticLayer("oasis", tileset, 0, 0);

    if (level == 1){
        worldLayer = map.createStaticLayer("world1", tileset, 0, 0);
    }
    else if (level == 2) {
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
    scoreText = this.add.text(16, 1, 'level: ' + level, { fontSize: '32px', fill: '#000' });
    hydraText = this.add.text(300, 1, 'hydration: ' + hydration, { fontSize: '32px', fill: '#000' });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, worldLayer);


    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, water, collectWater, null, this);
}

function update ()
{
    if (gameOver)
    {
        if (level != 4) {
            let style = { font: "30px Tahoma", fill: "#3391CF", outline: "5px",align: "center" };
            text = this.add.text( this.cameras.main.centerX, this.cameras.main.centerY, "YOU FOUND THE OASIS\nPress SPACE to play next level", style );
            text.setOrigin( 0.5, 0.0 );
        }
        else {
            let style = { font: "30px Tahoma", fill: "#3391CF", outline: "5px",align: "center" };
            text = this.add.text( this.cameras.main.centerX, this.cameras.main.centerY, "YOU WON\nPress SPACE to restart game", style );
            text.setOrigin( 0.5, 0.0 ); 
        }
    }

    if(this.reset.isDown){
        this.scene.restart();
        this.music.stop();
        hydration = 100;
        gameOver = false;
        if (level == 4) {
            level = 1;
        }
    }
    
    player.body.setVelocity(0);

    //horizontal movement
    if (cursors.left.isDown)
    {
        player.setVelocityX(-260);
        
        hydration -= .05;
        hydraText.setText('hydration: ' + Math.round(hydration));

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(260);
        hydration -= .05;
        hydraText.setText('hydration: ' + Math.round(hydration));

        player.anims.play('right', true);
    }
    
    //vertical movement
    else if (cursors.up.isDown)
    {
        player.setVelocityY(-260);
        hydration -= .05;
        hydraText.setText('hydration: ' + Math.round(hydration));

        player.anims.play('down', true);
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(260);
        hydration -= .05;
        hydraText.setText('hydration: ' + Math.round(hydration));

        player.anims.play('up', true);
    }
    else
    {
        player.setVelocityX(0);
        hydration -= .005;
        hydraText.setText('hydration: ' + Math.round(hydration));
        player.anims.play('turn');
    }
}

function collectWater (players, bottle)
{
    bottle.disableBody(true, true);

    //  Add and update the score
    level += 1;
    scoreText.setText('level: ' + level);
    hydraText.setText('hydration: ' + hydration);

    if (water.countActive(true) === 0)
    {
        this.physics.pause();
        players.anims.play('turn');
        gameOver = true;
    }
}


    

