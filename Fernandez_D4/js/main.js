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
    width: 805,
    height: 700,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 375 },
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
var cherryCollected = false;
var strawberry;
var strawberryCollected = false;
var apple;
var appleCollected = false;
var bombs;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var levelText;
var level = 1;
var text;
var cleared = false;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bg', 'assets/bg.jpg');
    this.load.image("tiles","assets/map_tiles.png");
    this.load.tilemapTiledJSON("map", "assets/world_map.json");
    this.load.image('cherry1', 'assets/cherry.png');
    this.load.image('strawberry1', 'assets/strawberry.png');
    this.load.image('apple1', 'assets/apple.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/little_man.png', { frameWidth: 31.5, frameHeight: 48 });
    //add music
    this.load.audio('bgm', 'assets/music.mp3');
}

function create ()
{
    //play bgm
    this.music = this.sound.add('bgm', {volume: 0.04}); 
    this.music.play();

    //load map and tileset
    const map = this.make.tilemap({key: "map"});
    const tileset = map.addTilesetImage("map_tiles","tiles");
    //load background image
    this.add.image(400,350,'bg');

    //load world layer according to level
    let worldLayer;

    if (level == 1) {
        worldLayer = map.createStaticLayer("world1", tileset, 0, 0);
        map.createStaticLayer("world1.5", tileset, 0, 0);
    }
    else if (level == 2) {
        worldLayer = map.createStaticLayer("world2", tileset, 0, 0);
        map.createStaticLayer("world2.5", tileset, 0, 0);
    }
    else {
        worldLayer = map.createStaticLayer("world3", tileset, 0, 0);
        map.createStaticLayer("world3.5", tileset, 0, 0);
    }

    //set collision
    worldLayer.setCollisionByProperty({ collides: true });

    //add player
    player = this.physics.add.sprite(20, 550, 'dude');

    //add player collision
    player.setCollideWorldBounds(true);

    //add reset button
    this.reset = this.input.keyboard.addKey('SPACE');

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

    //input
    cursors = this.input.keyboard.createCursorKeys();

    //create cherries
    cherry = this.physics.add.group({
        key: 'cherry1',
        repeat: 8,
        setXY: { x: 20, y: 100, stepX: 95 }
    });

    cherry.children.iterate(function (child) {

        child.setBounceY(0.3);

    });

    //create strawberries
    strawberry = this.physics.add.group({
        key: 'strawberry1',
        repeat: 8,
        setXY: { x: 20, y: 400, stepX: 90 }
    });

    strawberry.children.iterate(function (child) {

        child.setBounceY(0.3);

    });

    //create apples
    apple = this.physics.add.group({
        key: 'apple1',
        repeat: 8,
        setXY: { x: 150, y: 600, stepX: 75 }
    });

    apple.children.iterate(function (child) {

        child.setBounceY(0.3);

    });

    bombs = this.physics.add.group();

    //print score
    scoreText = this.add.text(16, 1, 'score: ' + score, { fontSize: '32px', fill: '#000' });
    //print level
    levelText = this.add.text(16, 35, 'level: ' + level, { fontSize: '32px', fill: '#000' });

    let style = { font: "30px Droid Sans", fill: "#000000", outline: "5px",align: "center" };
            text = this.add.text( this.cameras.main.centerX, this.cameras.main.centerY, "COLLECT VIALS & AVOID BOMBS!\nUSE CURSORS TO MOVE", style );
            text.setOrigin( 0.3, 5.4 ); 
    

    //set collision with world layer
    this.physics.add.collider(player, worldLayer);
    this.physics.add.collider(cherry, worldLayer);
    this.physics.add.collider(strawberry, worldLayer);
    this.physics.add.collider(apple, worldLayer);
    this.physics.add.collider(bombs, worldLayer);

    //check player overlap to collect vials
    this.physics.add.overlap(player, cherry, collectCherry, null, this);
    this.physics.add.overlap(player, strawberry, collectStrawberry, null, this);
    this.physics.add.overlap(player, apple, collectApple, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update ()
{
    if (gameOver)
    {
        gameOver = true;

        let style = { font: "30px Droid Sans", fill: "#FFFFFF", outline: "5px",align: "center" };
        text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "YOU HIT A BOMB! Your final score was "+score+"\nPress SPACE to restart game", style );
        text.setOrigin( 0.5, 2.4 );  
        this.physics.pause();
    }

    if(cleared) {
        if (level != 4) {
            let style = { font: "30px Droid Sans", fill: "#FFFFFF", outline: "5px",align: "center" };
            text = this.add.text( this.cameras.main.centerX, this.cameras.main.centerY, "YOU COLLECTED ALL VIALS!\nPress SPACE to play next level", style );
            text.setOrigin( 0.5, 2.4 );
        }
        else {
            let style = { font: "30px Droid Sans", fill: "#FFFFFF", outline: "5px",align: "center" };
            text = this.add.text( this.cameras.main.centerX, this.cameras.main.centerY, "YOU WON! Your final score was "+score+ "\nPress SPACE to restart game", style );
            text.setOrigin( 0.5, 2.4 ); 
        }
    }

    if(this.reset.isDown){
        this.scene.restart();
        this.music.stop();
        cherryCollected = false;
        strawberryCollected = false;
        appleCollected = false;
        cleared = false;
        if (level == 4) {
            level = 1;
            score = 0;
        }
        if (gameOver == true) {
            level = 1;
            score = 0;
        }
        gameOver = false;
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

    if (cursors.up.isDown && player.body.onFloor())
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
        cherryCollected = true;

        var x = (players.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 200);

    }
    if(cherryCollected===true && strawberryCollected===true && appleCollected===true) {
        this.physics.pause();
        cleared = true;
        level+=1;
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
        strawberryCollected = true;

        var x = (players.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-100, 100), 100);

    }
    if(cherryCollected===true && strawberryCollected===true && appleCollected===true) {
        this.physics.pause();
        cleared = true;
        level+=1;
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
        appleCollected = true;

        var x = (players.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-50, 50), 20);

    }
    if(cherryCollected===true && strawberryCollected===true && appleCollected===true) {
        this.physics.pause();
        cleared = true;
        level+=1;
    }
}
function hitBomb (players, bomb)
{
    this.physics.pause();

    players.setTint(0xB03A2E);

    players.anims.play('turn');

    gameOver = true;
}

    

