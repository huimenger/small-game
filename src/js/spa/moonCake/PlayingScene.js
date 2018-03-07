var PlayingScene = Hilo.Class.create({
  Extends : Hilo.Container ,
  constructor : function( properties ){
    PlayingScene.superclass.constructor.call(this,properties);

    /*
       初始化一些设置
    */
    this.properties = properties;
    this.width = properties.width;
    this.height = properties.height;
    this.deleteHeight = properties.height + 300;

    //初始下落速度
    this.speed = 2500 ;
    //设置每个怪物之间上下的距离
    this.TopBottomDistamce = 600 ;
    //兔子移动的初始速度
    this.rabbitSpeed = 150 ;
    //每一列的宽度
    this.size = properties.size ;

    //出怪的时间
    this.timeSpeed = 1000 ;

    //地面移动的初始速度
    this.backgroundSpeed = 2500 ;

    //出障碍物的概率   最大10
    this.blockProbability = 5 ;

    //物体出现的数量索引值
    this.index = 0 ;

    //当前人物状态    false 为死亡
    this.DEAD = true ;

    //当前得分
    this.score = null ;

    //兔子的初始定位
    this.rabiitPost = properties.rabbitPost || "CENTER";
    //兔子及障碍物的定位坐标
    this.initPost = properties.initPost;
    //获取定时器方法
    this.tiker = properties.ticker;

    //本局可获得的最大金币数
    this.maxScore = 100 ;

    //当局时间差
    this.speedDifference = 0 ;

    //是否开启极限模式
    this.limitMode = false ;

    this.showTips = false ;

    //初始方法
    this.init( properties );

  },

  //在场景中出现的怪物东西
  ENEMY : {
    WOLF : null ,
    TIGER : null ,
    STONE : null
  },

  //在场景中出现的加分东西
  FOOD : {
    CAKE : null ,
    LOGO : null ,
  },
  //所有怪物或者加分物体的数组
  monster : [] ,


  init : function( properties ){
    var self = this;

    // //创建背景
    // this.groundBg = new Hilo.Bitmap({
    //     id : "groundBg" ,
    //     image : properties.ground ,
    //     x : 0 ,
    //     y : -1334
    // });
    //创建兔子
    this.rabbit = new Hilo.Sprite({
          id : "rabbit" ,
          frames: properties.atlas.getSprite('rabbit') ,
          x: self.width / 2 - 71  ,
          y: self.height - 280 ,
          interval: 8,
          timeBased: false,
          loop: true,
          onEnterFrame: function(frameIndex){}
      });


    //创建颜色背景图
    this.backgruondContent = new Hilo.View({
      id : "backgruondContent" ,
      width : this.width ,
      height : this.height ,
      x : 0 ,
      y : 0 ,
      background : "#a8682a"
    });

    //创建背景柱子左
    this.pillarLeft = new Hilo.Bitmap({
        id : "pillarLeft" ,
        image : properties.ground ,
        rect : [0 ,0 , 100 ,2668] ,
        x : 0 ,
        y : -1334
    });
    //创建背景柱子左
    this.pillarRight = new Hilo.Bitmap({
        id : "pillarRight" ,
        image : properties.ground ,
        rect : [112 ,0 , 93 ,2668] ,
        x : this.width - 93 ,
        y : -1334
    });


    //创建显示分数的背景
    self.scoreBg = new Hilo.Bitmap({
        id : "scoreBg" ,
        image : properties.textScene ,
        rect : [811,0,146,52] ,
        x : self.width - 350,
        y : 20 ,
        scaleX : 1.5 ,
        scaleY : 1.5
    });

    //创建显示分数的文字
    self.scoreLabel = new Hilo.Text({
        color : "#fff",
        lineSpacing : 3 ,
        font : "48px arial" ,
        text : self.score ,
        textAlign : "center" ,
        textVAlign : "middle" ,
        height : 75 ,
        width : 120 ,
        x :  self.width - 260,
        y : 28 ,
    });


    //设置每次吃到的分数显示
    self.addScoreBg = new Hilo.Bitmap({
        id : "addScoreBg" ,
        image : properties.textScene ,
        rect : [811,57,71,43] ,
        x : 0 ,
        y : self.height - 300 ,
        visible : false ,
        alpha : 0 ,

    });
    //设置每次吃到的分数显示文本
    self.addScoreLabel = new Hilo.Text({
        color : "#a20405",
        lineSpacing : 3 ,
        font : "40px arial" ,
        text : "+1" ,
        textAlign : "center" ,
        textVAlign : "middle" ,
        height : 43 ,
        width : 71 ,
        x : 0 ,
        y : self.height - 300 ,
        visible : false ,
        alpha : 0
    });


    /*
      创建所有的对象
    */
    //创建狼
    this.ENEMY.WOLF = function(i){
      return new Hilo.Bitmap({
        id : "enemy_" + i,
        image : properties.event ,
        rect : [4,4,210,210],
        scaleX : 0.8 ,
        scaleY : 0.8 ,
        boundsArea : [
          {x:0,y:20},
          {x:210,y:20},
          {x:0,y:175},
          {x:210,y:175},
        ]
      });
    };

    //创建老虎
    this.ENEMY.TIGER = function(i){
      return new Hilo.Bitmap({
        id : "enemy_" + i,
        image : properties.event ,
        rect : [215,202, 165 ,215],
        scaleX : 0.8 ,
        scaleY : 0.8 ,
        boundsArea : [
          {x:0,y:50},
          {x:165,y:50},
          {x:0,y:145},
          {x:165,y:145},
        ]
      });
    };

    //创建石头
    this.ENEMY.STONE = function(i){
      return new Hilo.Bitmap({
        id : "enemy_" + i,
        image : properties.event ,
        rect : [0,223, 144 ,145],
        boundsArea : [
          {x:0,y:10},
          {x:144,y:10},
          {x:0,y:123},
          {x:144,y:123},
        ]
      });
    };
    //创建月饼
    this.FOOD.CAKE = function(i){
      return new Hilo.Bitmap({
          id : "1_food_"  + i,
          addScore : 1 ,
          image :  properties.event ,
          rect : [410,4,84,135],
          boundsArea : [
            {x:0,y:0},
            {x:81,y:0},
            {x:0,y:60},
            {x:81,y:60},
          ]
      });
    };
    //创建logo
    this.FOOD.LOGO = function(i){
      return new Hilo.Bitmap({
          id : "2_food_"  + i,
          addScore : 2 ,
          image :  properties.event ,
          rect : [220,4,188,198],
          scaleX : 0.7 ,
          scaleY : 0.7 ,
          boundsArea : [
            {x:0,y:0},
            {x:188,y:0},
            {x:0,y:143},
            {x:188,y:143},
          ]
      });
    };

    //添加到父类
    this.addChild(this.backgruondContent,this.pillarLeft,this.pillarRight, this.rabbit ,self.scoreBg ,self.scoreLabel ,self.addScoreBg ,self.addScoreLabel  );

    this.timeSpeed = Math.round(self.TopBottomDistamce/(self.deleteHeight/self.speed));



  } ,

  generate : function(){
      var self = this ;
      //初始化重置数据
      self.reset();

      function go(){
        //console.log("我在造孙子")
        //如果已经死亡 则退出
        if(!self.DEAD) return ;
        var rand = self.random(1,10);

        //当随机数小于这个概率值时则出现怪物
        if(rand < self.blockProbability){
            showBlock(true);
          //当出现加分物体的时候
        }else{
            showBlock(false);
        }
        if(self.DEAD){
          self.tiker.timeout(go ,self.timeSpeed);
        }
      }

      self.tiker.timeout(function(){
        go();
      },3000);
      function showBlock( currentClass ){
        var block = null ,
            hd = null ,
            leftPos = self.random(0,2) ,
            cakePosi = 0 ;
        //为true则为怪物
        if(currentClass){
            hd = self.random(0,2);

            switch (hd){
              case 0 :
                block = self.ENEMY.WOLF(self.index);
                break;
              case 1 :
                block = self.ENEMY.TIGER(self.index);
                break;
              case 2 :
                block = self.ENEMY.STONE(self.index);
                break;
            }
        }else{
          hd = self.random(1,4);
          switch (hd){
            case 1 :
            case 2:
            case 3 :
              block = self.FOOD.CAKE(self.index);
              cakePosi = 30 ;
              break;
            case 4 :
              block = self.FOOD.LOGO(self.index);
              break;
          }
        }
        block.x = (leftPos == 0 ? self.initPost.left : leftPos == 1 ? self.initPost.center : self.initPost.right)+cakePosi;
        block.y = -(block.height -10) ;
        self.addChild(block,self.scoreBg ,self.scoreLabel);
        self.monster.push(block);
        Hilo.Tween.to(block , { y : self.deleteHeight} , { duration : self.speed });
        moveTweenFunc(self.monster);
        self.index++;
      }

      function moveTweenFunc( monsterArr ){
          for (var i = 0 ; i < monsterArr.length ; i++){
              if(monsterArr[i].y >= self.deleteHeight+200 ){
                  self.monster.splice(i,1);
                  self.removeChild(monsterArr[i]);
                  //console.log(self);
              }
          }
      }


  },
  random : function(min , max){
    return Math.round((max-min)*Math.random())+min;
  } ,

  //碰撞检测方法
  checkCollision : function( rabbit ){
        for(var i = 0 ; i < this.monster.length ; i++){
          if(rabbit.hitTestObject(this.monster[i],false)){
            var monsterClass = this.monster[i].id.indexOf("food_") != -1 ? false : true ;
            if(monsterClass){
              return true ;
            }else{
              var addScore = parseInt(this.monster[i].id);
              this.updateScore(addScore);
              this.removeChild(this.monster[i]);
              this.monster.splice(i,1);
            }
          }
        }
          return false ;
  },

  updateScore : function( score ){
      var self = this;
      this.score = this.score + score;
      this.scoreLabel.text = this.score ;
      this.difficultySelect(this.score,score);
      //增加时间速度
      this.timeSpeed = Math.round(self.TopBottomDistamce/(self.deleteHeight/self.speed));
      var posX = (this.rabiitPost == "LEFT" ? this.initPost.left : this.rabiitPost == "CENTER" ? this.initPost.center : this.initPost.right ) + 30;
      this.addScoreBg.x = posX ;
      this.addScoreLabel.x = posX ;

      this.addChild(this.addScoreBg,this.addScoreLabel);
      this.addScoreBg.visible = true ;
      this.addScoreLabel.visible = true ;
      this.addScoreBg.alpha = 1 ;
      this.addScoreLabel.alpha = 1 ;
      this.addScoreLabel.text = "+" + score;
      Hilo.Tween.to(this.addScoreBg,{y:this.addScoreBg.y+100} , {duration:300});
      Hilo.Tween.to(this.addScoreBg,{alpha:0} , {duration:200,delay:300});
      Hilo.Tween.to(this.addScoreLabel,{y:this.addScoreBg.y+100} , {duration:300});
      Hilo.Tween.to(this.addScoreLabel,{alpha:0} , {duration:200,delay:300});

      //恢复默认定位值
      self.tiker.timeout(function(){
        self.addScoreBg.y = self.height - 300  ;
        self.addScoreBg.alpha = 1 ;
        self.addScoreBg.visible = false ;
        self.addScoreLabel.y = self.height - 300  ;
        self.addScoreLabel.alpha = 1  ;
        self.addScoreLabel.visible = false ;
      },505);
  },
  //根据得分情况改变游戏难度
  difficultySelect : function( currentScore ,score  ){

    if(  currentScore <  this.maxScore - 10 ){
      //开启极限模式
    }
      if(currentScore > this.maxScore/2){
          this.rabbitSpeed = 100;
          this.rabbit.interval = 7 ;
      }
      if( currentScore > this.maxScore/4){
          this.rabbitSpeed = 10;
          this.rabbit.interval = 6 ;
      }
      if( currentScore > this.maxScore/6 ){
          this.rabbit.interval = 5 ;
      }


      //获取本局的时间差
      this.speed = this.speed - (score * this.speedDifference) ;

  },
  //更新兔子的当前位置
  rabiitPostUpdate : function( post ){
    this.rabiitPost = post || "CENTER";
  } ,
  //游戏结束清楚所有子集
  removeChildFunc : function(){
      this.monster = [];
      this.removeAllChildren();
      this.addChild( this.backgruondContent,this.pillarLeft,this.pillarRight,this.rabbit ,this.scoreBg ,this.scoreLabel ,this.addScoreBg ,this.addScoreLabel);
  },

  reset : function(){


    this.monster = [] ;
    this.index = 0 ;
    this.rabiitPost = "CENTER";
    this.scoreLabel.text = 0;
    this.DEAD = true;
    this.getChildById('rabbit').x = this.initPost.center;
    this.score = 0 ;
    this.speed = 2500 ;
    this.rabbitSpeed = 150 ;

  }
});


export default PlayingScene;
