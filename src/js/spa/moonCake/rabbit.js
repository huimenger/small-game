
var Rabbit = Hilo.Class.create({
    Extends: Hilo.Sprite,
    constructor: function(properties){
        Rabbit.superclass.constructor.call(this, properties);
        console.log(properties)
        this.addFrame(properties.atlas.getSprite('rabbitAtlas'));

        this.interval = 6;
    },

    isDead: true, //小鸟是否已死亡


    getReady: function(){

        //设置起始坐标
        this.x = this.startX;
        this.y = this.startY;

        this.rotation = 0;
        this.interval = 6;
        this.play();
    },

    startFly: function(){
        this.isDead = false;
        this.interval = 3;
        this.flyStartY = this.y;
        this.flyStartTime = +new Date();
        if(this.tween) this.tween.stop();
    }
});
  export default Rabbit;
