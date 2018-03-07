let GameOverScene = Hilo.Class.create({
  Extends : Hilo.Container ,
  constructor : function( properties ){
    GameOverScene.superclass.constructor.call(this , properties );
    this.ticker = properties.ticker ;
    this.init(properties);
  } ,
  init : function( properties ){
     let self = this ;
      let startBg = new Hilo.Bitmap({
        id : "startBg" ,
        image : properties.startBg ,
        x : 0 ,
        y : 0 ,
        width : this.width ,
        height : this.height
      });

      //旋转的光
      let endScoreLight = new Hilo.Bitmap({
        id : "rotateBg" ,
        image : properties.light ,
        rect : [0,0,749,749] ,
        x : this.width/2 ,
        y : this.height/2-200 ,
        rotation : 10,
        pivotX : 374.5,
        pivotY : 374.5,
        scaleX : 2 ,
        scaleY : 2
      });

      let endScore = new Hilo.Bitmap({
        id : "scoreBg" ,
        image : properties.gameOverdef ,
        rect : [0,0, 526,572] ,
        x : this.width/2 - 262,
        y : this.height/2-450 ,
      });

      //兑换金币按钮
      let subBtn = new Hilo.Button({
        id : "subBtn" ,
        image : properties.text ,
        width : 472,
        height : 117 ,
        upState: {rect : [3,246,472,117]} ,
        downState:  {rect : [479,248 ,472,117]} ,
        x : this.width / 2 - 500/2 ,
        y : this.height / 2 +160
      });

      //再玩一次
      let rePlayBtn = new Hilo.Button({
        id : "rePlayBtn" ,
        image : properties.text ,
        width : 472,
        height : 117 ,
        upState: {rect : [4,124,472,117]} ,
        downState:  {rect : [480,124 ,472,117]} ,
        disabledState : {rect : [4,124,472,117]} ,
        x : this.width / 2 - 500/2 ,
        y : this.height / 2 +340
      });
      rePlayBtn.setEnabled(false);

      //提交兑换表单背景
      let formViewBg = new Hilo.View({
        id : "formViewBg" ,
        image : properties.text ,
        width : this.width ,
        height : this.height ,
        x : 0 ,
        y : 0 ,
        background : "rgba(0,0,0,0.5)"
      });

      //提交兑换表单背景
      let formViewBg2 = new Hilo.View({
        id : "formViewBg2" ,
        image : properties.text ,
        width : this.width ,
        height : this.height ,
        x : 0 ,
        y : 0 ,
        background : "rgba(0,0,0,0.5)"
      });

      //兑换成功显示分享加金币
      let shareAddGold = new Hilo.Bitmap({
        id : "shareAddGold" ,
        image :  properties.textScene ,
        rect : [0,0,642,506],
        x : this.width/2 - 321 ,
        y : this.height/2 - 253 ,
      });
      //兑换成功显示分享加金币
      let shareAddGold2 = new Hilo.Bitmap({
        id : "shareAddGold2" ,
        image :  properties.textScene ,
        rect : [0,0,642,506],
        x : this.width/2 - 321 ,
        y : this.height/2 - 253 ,
      });

      let shareIcon_1 = new Hilo.Bitmap({
        id : "shareIcon_1" ,
        image :  properties.textScene ,
        rect : [651,393,210,216],
        x : this.width/2 - 105 ,
        y : this.height/2 - 310 ,
      });
      let shareIcon_2 = new Hilo.Bitmap({
        id : "shareIcon_2" ,
        image :  properties.textScene ,
        rect : [651,616,210,216],
        x : this.width/2 - 105 ,
        y : this.height/2 - 320 ,
      });
      let goldIcon = new Hilo.Bitmap({
        id : "goldIcon" ,
        image :  properties.textScene ,
        rect : [127,529,78,55],
        x : this.width/2 - 90 ,
        y : this.height/2 - 60 ,
      });
      let goldIcon2 = new Hilo.Bitmap({
        id : "goldIcon2" ,
        image :  properties.textScene ,
        rect : [127,529,78,55],
        x : this.width/2 - 90 ,
        y : this.height/2 - 60 ,
        visible : true
      });

      let bestLabel2 = new Hilo.BitmapText({
            id: 'bestLabel2',
            glyphs: properties.number2Glyphs,
            letterSpacing: 0,
            text: 0 ,
            width: 180 ,
            textAlign:"left",
            x : this.width/2 - 10,
            y : this.height/2- 65 ,
        });
        let bestLabel22 = new Hilo.BitmapText({
              id: 'bestLabel22',
              glyphs: properties.number2Glyphs,
              letterSpacing: 0,
              text: 0 ,
              width: 180 ,
              textAlign:"left",
              x : this.width/2 - 10,
              y : this.height/2- 65 ,
          });

      let bestLabel = new Hilo.BitmapText({
            id: 'numberText',
            glyphs: properties.numberGlyphs,
            letterSpacing: 0,
            text: 0 ,
            width: 180 ,
            textAlign:"center",
            x : this.width/2 -10,
            y : this.height/2-260 ,
        });

        let jjText = new Hilo.Text({
              id: 'jjText',
              font : "30px 微软雅黑" ,
              maxWidth :this.width ,
              glyphs: properties.number2Glyphs,
              letterSpacing: 0,
              color : "#725609" ,
              width: this.width  ,
              textAlign:"center",
              text : "恭喜您成功兑换金币" ,
              x : 0,
              y : this.height/2  + 20,
          });
          let jjText2 = new Hilo.Text({
                id: 'jjText2',
                font : "30px 微软雅黑" ,
                maxWidth :this.width ,
                glyphs: properties.number2Glyphs,
                letterSpacing: 0,
                color : "#725609" ,
                width: this.width  ,
                textAlign:"center",
                text : "恭喜您成功兑换金币" ,
                x : 0,
                y : this.height/2  + 20,
            });

        //去看书按钮
        let goReadBtn = new Hilo.Button({
          id : "goReadBtn" ,
          image : properties.text2 ,
          width : 472,
          height : 117 ,
          upState: {rect : [4,124,472,117]} ,
          downState:  {rect : [476,122 ,472,117]} ,
          disabledState : {rect : [4,124,472,117]} ,
          x : this.width / 2 - 500/2 ,
          y : this.height / 2 + 90 ,
        });

        //分享按钮
        let shareBtn = new Hilo.Button({
          id : "shareBtn" ,
          image : properties.text2 ,
          width : 472,
          height : 117 ,
          upState: {rect : [4,1,472,117]} ,
          downState:  {rect : [476,1 ,472,117]} ,
          disabledState : {rect : [4,1,472,117]} ,
          x : this.width / 2 - 500/2 ,
          y : this.height / 2 + 90 ,
        });

      //关闭界面按钮
      let closeShareViewBtn = new Hilo.View({
        id : "closeShareViewBtn" ,
        width : 100 ,
        height : 100,
        x : this.width/2 + 221 ,
        y : this.height/2 - 260 ,
        visible : true ,
        background : "rgba(0,0,0,0)"
      });
      //关闭界面按钮
      let closeShareViewBtn2 = new Hilo.View({
        id : "closeShareViewBtn2" ,
        width : 100 ,
        height : 100,
        x : this.width/2 + 221 ,
        y : this.height/2 - 260 ,
        visible : true ,
        background : "rgba(0,0,0,0)"
      });

      //去阅读界面
      let readContainer = new Hilo.Container({
          id : "readContainer" ,
          width : this.width ,
          height : this.height ,
          x : 0 ,
          y : 0 ,
          children : [
            formViewBg ,shareAddGold , shareIcon_2 , goReadBtn  , bestLabel2 ,goldIcon , jjText, closeShareViewBtn
          ],
          visible : false
      });

      //去分享界面
      let shareContainer = new Hilo.Container({
          id : "shareContainer" ,
          width : this.width ,
          height : this.height ,
          x : 0 ,
          y : 0 ,
          children : [
            formViewBg2,shareAddGold2, shareIcon_1 , shareBtn  , bestLabel22 ,goldIcon2  ,closeShareViewBtn2 ,jjText2
          ],
          visible : false
      });



      this.addChild(startBg ,endScoreLight ,endScore ,subBtn ,rePlayBtn,bestLabel ,shareContainer ,readContainer);

      this.ticker.timeout(function(){
          rePlayBtn.setEnabled(true);
      },510);
      Hilo.Tween.to(endScoreLight,{rotation:360} , {duration:8000,loop:true} );

      //给关闭按钮绑定事件
      closeShareViewBtn.on(Hilo.event.POINTER_START , function(e){
        e._stopped = true;
        e.preventDefault();
      }).on(Hilo.event.POINTER_END, function(e){
          self.hideShareView();
      });


      this.showScore(properties.score);
      window.showShareViewA = this.getChildById('shareContainer');
      window.showShareViewB = this.getChildById('readContainer');

      self.getChildById('shareContainer').getChildById('closeShareViewBtn2').on(Hilo.event.POINTER_START , function(e){
        e._stopped = true;
        e.preventDefault();
      }).on(Hilo.event.POINTER_END, function(e){
            self.getChildById('shareContainer').visible = false ;
      });
      self.getChildById('readContainer').getChildById('closeShareViewBtn').on(Hilo.event.POINTER_START , function(e){
        e._stopped = true;
        e.preventDefault();
      }).on(Hilo.event.POINTER_END, function(e){
            self.getChildById('readContainer').visible = false ;
      });
  } ,
  showScore : function( score ){
      //console.log(score);
      this.getChildById('numberText').setText(score);
      console.log(score)
      this.getChildById('readContainer').getChildById('bestLabel2').setText("x"+score);
      this.getChildById('shareContainer').getChildById('bestLabel22').setText("x"+score);
  } ,
  showShareView : function( curent ){
      //curent 为true时显示去分享
      if(curent){
        this.getChildById('shareContainer').visible = true ;
      }else{
        this.getChildById('readContainer').visible = true ;
      }
  },
  hideShareView : function(){
    this.getChildById('readContainer').visible = false ;
    this.getChildById('shareContainer').visible = false ;
  }
});


export default GameOverScene ;
