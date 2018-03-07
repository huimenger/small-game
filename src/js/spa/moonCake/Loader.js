import cs from "./domEvent.js";
var LoaderSecen = Hilo.Class.create({
      Mixes: Hilo.EventMixin,
      //加载队列
      quene : null,
      queneAll : 0 ,
      curPropertion : 0 ,
      //图片
      text : null ,
      startBg : null ,
      startScene : null ,
      monster : null ,
      ground : null ,
      load : function(){
          var resources = [
            { id : "startBg" , src : "./img/moonCake/startBg.jpg"},
            { id : "textScene" , src : "./img/moonCake/textScene.png"},
            { id : "text" , src : "./img/moonCake/text.png"},
            { id : "monster" , src : "./img/moonCake/monster.png"},
            { id : "ground" , src : "./img/moonCake/ground.png"},
            { id : "light" , src : "./img/moonCake/light2.png"},
            { id : "number" , src : "./img/moonCake/number3.png"},
            { id : "number2" , src : "./img/moonCake/number2.png"},
            { id : "homeUi" , src : "./img/moonCake/homeUi.png"},
            { id : "text2" , src : "./img/moonCake/text3.png"},
            { id : "rabbit" , src : "./img/moonCake/rabbit.png"},
            { id : "gameOverdef" , src : "./img/moonCake/gameOverdef.png"}
          ];
          this.quene = new Hilo.LoadQueue();
          this.quene.add(resources);
          //监听加载完成
          this.quene.on("complete" , this.onComplete.bind(this));
          //监听当前加载的位置
          this.quene.on("load" , this.imgLoader.bind(this));
          //开始
          this.quene.start();
          this.queneAll = this.quene.getTotal();
      },
      //加载完成调用
      onComplete : function(){
        var self = this ;
         setTimeout(function(){
           cs.fadeLimit(document.querySelector(".load_bg") , 100 , 0);
         },500);

        console.log("图片加载完成!!");

        //获取图片
        this.getImage();

        this.quene.off('complete');
        this.fire('complete');
      } ,

      imgLoader : function(){
        //当前下载
        var self = this ;
        var initN = 0 ;
        var curentPro = ( self.quene.getLoaded() / self.queneAll ).toFixed(2) * 100 ;
        go(curentPro);
        //document.querySelector(".complete_val").style.width = this.curPropertion + "%";
        function go ( n ){
            initN = n > 0 ? n : initN ;
            if( initN > self.curPropertion ){
                self.curPropertion++;
                document.querySelector(".complete_val").innerHTML = self.curPropertion + "%";
                setTimeout( go , 1);
            }else{
              initN = 0 ;
            }
        }
      } ,

      getImage : function(){
        //this.loading = this.quene.get("loading").content ;
        this.startBg = this.quene.get("startBg").content ;
        this.textScene = this.quene.get("textScene").content ;
        this.text = this.quene.get("text").content ;
        this.monster = this.quene.get("monster").content ;
        this.ground = this.quene.get("ground").content ;
        this.light = this.quene.get("light").content ;
        this.homeUi = this.quene.get("homeUi").content ;
        this.text2 = this.quene.get("text2").content ;
        this.gameOverdef = this.quene.get("gameOverdef").content ;
        var number = this.quene.get("number").content ;
        var number2 = this.quene.get("number2").content ;
        var rabbit = this.quene.get("rabbit").content ;

        this.rabbitAtlas = new Hilo.TextureAtlas({
            image: rabbit,
            frames: [
                [177, 12, 160, 219],
                [4,16,170, 215 ],
                [177, 12, 160, 219],
                [349, 12, 168, 213]
            ],
            sprites: {
                rabbit: [0,1,2,3]
            }
        });


        this.numberGlyphs = {
          0 : {image : number ,rect:[ 0 , 0 , 58 , 92]} ,
          1 : {image : number ,rect:[ 58 , 0 , 58 , 92]} ,
          2 : {image : number ,rect:[ 116 , 0 , 58 , 92]} ,
          3 : {image : number ,rect:[ 174 , 0 , 58 , 92]} ,
          4 : {image : number ,rect:[ 232 , 0 , 58 , 92]} ,
          5 : {image : number ,rect:[ 290 , 0 , 58 , 92]} ,
          6 : {image : number ,rect:[ 348 , 0 , 58 , 92]} ,
          7 : {image : number ,rect:[ 406 , 0 , 58 , 92]} ,
          8 : {image : number ,rect:[ 464 , 0 , 58 , 92]} ,
          9 : {image : number ,rect:[ 522 , 0 , 58 , 92]} ,
        } ;
        //console.log(number2)
        this.number2Glyphs = {
          x : {image : number2 ,rect:[ 0 , 0 , 38 , 60]} ,
          0 : {image : number2 ,rect:[ 38 , 0 , 36 , 60]} ,
          1 : {image : number2 ,rect:[ 74 , 0 , 36 , 60]} ,
          2 : {image : number2 ,rect:[ 110 , 0 , 36 , 60]} ,
          3 : {image : number2 ,rect:[ 146 , 0 , 36 , 60]} ,
          4 : {image : number2 ,rect:[ 182 , 0 , 36 , 60]} ,
          5 : {image : number2 ,rect:[ 218 , 0 , 36 , 60]} ,
          6 : {image : number2 ,rect:[ 254 , 0 , 36 , 60]} ,
          7 : {image : number2 ,rect:[ 290 , 0 , 36 , 60]} ,
          8 : {image : number2 ,rect:[ 328 , 0 , 36 , 60]} ,
          9 : {image : number2 ,rect:[ 364 , 0 , 36 , 60]} ,
        }
      } ,

    });

    export default LoaderSecen;
