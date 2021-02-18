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
            debug: false,
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
var levelUp = false;
var gameOver = false;
var levelText;
var hydration = 100;
var hydraText;

var game = new Phaser.Game(config);

function preload () {
    this.load.image("tiles", "assets/maze_tiles.png");
    this.load.image("water1","assets/water.png");
    this.load.tilemapTiledJSON("map", "assets/mazetrial.json");
    this.load.spritesheet('dude', 'assets/little_man.png', { frameWidth: 31.5, frameHeight: 48 });
    this.load.audio('bgm', 'assets/dune_style.ogg');
}

function create () {

    //load map and tileset
    const map = this.make.tilemap({key: "map"});
    const tileset = map.addTilesetImage("maze_tiles","tiles");

    //play bgm
    this.music = this.sound.add('bgm', {volume: 0.10}); 
    this.music.play();

    //load map layers
    let worldLayer;
    this.groundLayer = map.createStaticLayer("ground", tileset, 0, 0);
    this.oasis = map.createStaticLayer("oasis", tileset, 0, 0);

    //load world layer according to level
    if (level == 1) {
        worldLayer = map.createStaticLayer("level1", tileset, 0, 0);
    }
    else if (level == 2) {
        worldLayer = map.createStaticLayer("level2", tileset, 0, 0);
    }
    else {
        worldLayer = map.createStaticLayer("level3", tileset, 0, 0);
    }

    //set collision on map
    worldLayer.setCollisionByProperty({ collides: true });

    //add the player
    player = this.physics.add.sprite(300, 900, 'dude');

    //reset button
    this.reset = this.input.keyboard.addKey('SPACE');

    //player physics properties
    player.setCollideWorldBounds(true);

    //player animations
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

    //cursor input Events
    cursors = this.input.keyboard.createCursorKeys();
    
    //add waterbottle
    water = this.physics.add.group({
        key: 'water1',
        setXY: { x: 480, y: 480 }
    })

    //print level and hydration stats
    levelText = this.add.text(32, 1, 'level: ' + level, { fontSize: '32px', fill: '#000' });
    hydraText = this.add.text(668, 1, 'hydration: ' + hydration, { fontSize: '32px', fill: '#000' });

    //collide the player with map walls
    this.physics.add.collider(player, worldLayer);


    //checks to see if the player overlaps with the water bottle
    this.physics.add.overlap(player, water, collectWater, null, this);
}

function update ()
{
    //end game and print if hydration reaches 0
    if(hydration < 0) {
        gameOver = true;

        let style = { font: "30px Droid Sans", fill: "#3391CF", outline: "5px",align: "center" };
        text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "YOU DIED OF THRIST!\nPress SPACE to restart game", style );
        text.setOrigin( 0.5, 2.4 ); 
        this.physics.pause();
    }

    //level up is true if water bottle is collected
    if (levelUp)
    {
        if (level != 4) {
            let style = { font: "30px Droid Sans", fill: "#3391CF", outline: "5px",align: "center" };
            text = this.add.text( this.cameras.main.centerX, this.cameras.main.centerY, "YOU FOUND THE OASIS!\nPress SPACE to play next level", style );
            text.setOrigin( 0.5, 2.4 );
        }
        else {
            let style = { font: "30px Droid Sans", fill: "#3391CF", outline: "5px",align: "center" };
            text = this.add.text( this.cameras.main.centerX, this.cameras.main.centerY, "YOU WON!\nPress SPACE to restart game", style );
            text.setOrigin( 0.5, 2.4 ); 
        }
    }

    if(this.reset.isDown){
        this.scene.restart();
        this.music.stop();
        hydration = 100;
        levelUp = false;
        if (level == 4) {
            level = 1;
        }
        if (gameOver == true) {
            level = 1;
        }
        gameOver = false;
    }
    
    player.body.setVelocity(0);

    //horizontal movement
    if (cursors.left.isDown)
    {
        player.setVelocityX(-260);
        if (levelUp == false && gameOver == false) { 
            hydration -= 0.1;
        }
        hydraText.setText('hydration: ' + Math.round(hydration));

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(260);
        if (levelUp == false && gameOver == false) { 
            hydration -= 0.1;
        }
        hydraText.setText('hydration: ' + Math.round(hydration));

        player.anims.play('right', true);
    }
    
    //vertical movement
    else if (cursors.up.isDown)
    {
        player.setVelocityY(-260);
        if (levelUp == false && gameOver == false) { 
            hydration -= 0.1;
        }
        hydraText.setText('hydration: ' + Math.round(hydration));

        player.anims.play('down', true);
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(260);
        if (levelUp == false && gameOver == false) { 
            hydration -= 0.1;
        }
        hydraText.setText('hydration: ' + Math.round(hydration));

        player.anims.play('up', true);
    }
    else
    {
        player.setVelocityX(0);
        if (levelUp == false && gameOver == false) { 
            hydration -= 0.05;
        }
        hydraText.setText('hydration: ' + Math.round(hydration));
        player.anims.play('turn');
    }
}

function collectWater (players, bottle)
{
    bottle.disableBody(true, true);

    //  Add and update the level and restart hydration counter
    level += 1;
    levelText.setText('level: ' + level);
    hydraText.setText('hydration: ' + hydration);

    if (water.countActive(true) === 0)
    {
        this.physics.pause();
        players.anims.play('turn');
        levelUp = true;
    }
}


    

