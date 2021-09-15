let config, game, timedEvent, sfxCoin, activeScene;

config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1d1d1d',
    parent: 'phaserblock',
    physics: {
        default: 'matter',
        matter: {
            // This is the default value
            gravity: { y: 0.4 },

            // You can also pass in Matter.Engine config properties:
            //  http://brm.io/matter-js/docs/classes/Engine.html#properties
            enableSleep: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,

    }
};

//var gameWidth=game.config.width;
//var gameHeight=game.config.height;


initGame();

function muteGame() {
    game.sound.setMute(true);
}

function initGame() {
    game = new Phaser.Game(config);
}

function noop() {}
function preload ()
{
    activeScene = this;

    this.game.registry.events._events.blur = [];
    this.game.registry.events._events.focus = [];
    this.game.registry.events._events.hidden = [];
    this.game.onBlur                        = ()=>noop("blur");
    this.game.onFocus                       = ()=>noop("focus");
    this.game.onPause                       = ()=>noop("pause");
    // this.focusLoss                     = ()=>noop("focusloss");
    // this.focusGain                     = ()=>noop("focusgain");

    this.load.image('vault', 'assets/vault.png');
    this.load.image('coin', 'assets/coin.png');
    this.load.audio('coindrop', 'assets/coindrop.mp3');
}

function onEvent() {
    spawnCoins(this);
}

class Rectangle {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1; this.y1 = y1; this.x2 = x2; this.y2 = y2;
    }

    get Width() { return this.x2 - this.x1; }
    get Height() { return this.y2 - this.y1; }
}

function getInclusive(min, max)
{
    return Math.floor( Math.random() * (max + 1 - min) ) + min;
}

function getInclusiveFloat(min, max)
{
    return ( Math.random() * (max - min) ) + min;
}

function spawnCoins(scene, coinamt=1)
{
    let rectangle = new Rectangle(100, -600, 700, 0);

    let maxcols = 6;
    let maxrows = 3;
    let bucketwidth = rectangle.Width / maxcols;
    let bucketheight = rectangle.Height / maxrows;
    let offset_x = rectangle.x1;
    let offset_y = rectangle.y1;
    let center_x = bucketwidth * 0.5;
    let center_y = bucketheight * 0.5;

    let buckets = [];
    for(let i = 0; i < maxcols * maxrows; i++) buckets.push(i);



    for(let i = 0 ; i < coinamt; i++) {

        let bucket = buckets.splice(getInclusive(0, buckets.length - 1), 1)[0];
        let y = offset_y + (Math.floor(bucket / maxcols) * bucketheight) + (center_y * 0.5) + getInclusive(0, center_y);
        let x = offset_x + ((bucket % maxcols) * bucketwidth) + (center_x * 0.5) + getInclusive(0, center_x);
        // Phaser.Math.Between(100, 700), Phaser.Math.Between(-600, 0),

        let coin = scene.matter.add.image( x, y,'coin');
        //ball.setCircle(10); overriding the default collision box
        coin.body.allowRotation = true;
        coin.body.angularDrag = 10;
        coin.setFriction(0.1);
        coin.setBounce(0.2);
        scene.matter.body.setAngularVelocity(coin.body,  getInclusiveFloat(-0.3, 0.3));
    }
}

dictHasCollided = {};

function eventCollisionActive(data1, data2, data3, data4, data5, data6, data7) {
    console.log("collision active");

    let shouldPlay = false;

    for(let obj of data1.pairs)
    {
        for(let body of [obj.bodyA, obj.bodyB]) {
            let id = body.id;
            if (dictHasCollided[id] === undefined) {
                console.log("Unique object: " + id);
                shouldPlay = true;
            }
            dictHasCollided[id] = true;
        }
    }

    if(shouldPlay) sfxCoin.play();
    // if(!sfxCoin.isPlaying)
    //     sfxCoin.play();
    // else
    //     console.log("Sound already playing");

}

function create ()
{
    this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);
    //this.matter.world.on('collisionend', eventCollisionActive);
    this.matter.world.on('collisionstart', eventCollisionActive);
    //this.matter.world.setGravity(0, 0.1)
    sfxCoin = this.sound.add('coindrop');

    let vault = this.add.image(0, 0, 'vault').setOrigin(0, 0);
    vault.setDisplaySize(this.game.config.width, this.game.config.height);



    // timedEvent = this.time.delayedCall(1000, () => spawnCoins(this), [], this);
    // timedEvent = this.time.addEvent({ delay: 20, callback: onEvent, callbackScope: this, loop: true });

}

function update()
{
    // let ball = this.matter.add.image(Phaser.Math.Between(100, 700), Phaser.Math.Between(-600, 0), 'ball');
    // ball.setCircle(10);
    // //ball.setFriction(0.005);
    // ball.setFriction(0.005);
    // ball.setBounce(0.2);
}
