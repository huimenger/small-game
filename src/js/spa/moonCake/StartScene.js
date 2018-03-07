import cs from "./domEvent.js";
import * as cnzz from "../../commons/cnzz.js";

var activity = cnzz.activity("2016中秋活动","Android开屏");
var StartScene = Hilo.Class.create({
    Extends : Hilo.Container ,
    constructor : function( properties ){
      StartScene.superclass.constructor.call(this, properties);
      this.init(properties);
    },
    init : function(properties){
        var self = this;
        //背景
        var startBg = new Hilo.Bitmap({
          id : "startBg" ,
          image : properties.startBg ,
          x : 0 ,
          y : 0
        });

        //主题大图
        var homeUi = new Hilo.Bitmap({
          id : "homeUi" ,
          image : properties.homeUi ,
          x : 60 ,
          y : 200
        });

        //开始按钮
        var startBtn = new Hilo.Button({
          id : "startBtn" ,
          image : properties.text ,
          width : 472,
          height : 117 ,
          upState: {rect : [1,2,472,117]} ,
          downState:  {rect : [478,2 ,472,117]} ,
          x : this.width / 2 - 500/2 ,
          y : this.height / 2 + 350
        });

        //规则按钮
        var ruleBtn = new Hilo.Button({
          id : "ruleBtn" ,
          image : properties.text ,
          width : 176,
          height : 56 ,
          upState: {rect : [5,372,176,56]} ,
          downState:  {rect : [192,372 ,176,56]} ,
          x : this.width  - 200 ,
          y : this.height - 76
        });
        //获取当前默认状态
        self.musicCurrent = properties.musicCurrent ;

        //绑定查看规则按钮
        ruleBtn.on(Hilo.event.POINTER_START , function(e){
          e._stopped = true;
          e.preventDefault();
        }).on(Hilo.event.POINTER_END, function(e){
          try {
              activity.ac("点击查看规则");   // 记录登录按钮点击次数
          } catch (err) { console.log(err); }

          //console.log("查看规则");
          cs.show("rule");
          //绑定关闭按钮
          cs.$(".hide_but")[0].onclick = function(){
            cs.hide("rule");
          }
        });


        this.addChild(startBg,startBtn,ruleBtn,homeUi);

    } ,
});

export default StartScene;
