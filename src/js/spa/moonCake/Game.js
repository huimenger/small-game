import Hilo from "../../libs/hilo-standalone.js";
import cs from "./domEvent.js";
import * as cnzz from "../../commons/cnzz.js";
import LoaderSecen from "./Loader.js";
import StartScene from "./StartScene.js";
import PlayingScene from "./PlayingScene.js";
import GameOverScene from "./gameOver.js";
import Ajax from "../../commons/ajax.js";
import HostSdk from "../../libs/HostSdk.js";
import * as toast from "../../eui/Toast.js";

let text = toast.showText();


//var host = "";
var host = "http://www.sxyj.net";
/*
  通道类型channelType
  0     安卓开屏
  1     IOS开屏
  2     安卓（通知）
  3     IOS女频轮播
  4     IOS男频播
  5     IOS任务中心轮播
  6     安卓女频轮播
  7     安卓男频播
  8     安卓任务中心轮播
*/
var channelType = [
  "分享到朋友圈的数据" ,
  "安卓开屏" ,
  "IOS开屏",
  "安卓（通知）" ,
  "IOS女频轮播",
  "IOS男频轮播" ,
  "IOS任务中心轮播",
  "安卓女频轮播" ,
  "安卓男频轮播" ,
  "安卓任务中心轮播" ,
  "微信头条" ,
  "微博分享" ,
] ;
var index = parseInt(cs.getAdressUid("channeltype")) || 0;

var activity = cnzz.activity("2016中秋活动", channelType[index] );
var csGame = {

  //游戏界面配置
  width : 750,
  height : 1334,
  scale : 0,
  loader : null,
  //设置两边草坪的大小
  lawn : 80 ,
  //设置每一份中间的距离的宽度
  size : null ,
  //开始界面背景音乐默认状态
  musicCurrent : false ,
  //游戏场景
  StartScene : null ,
  //游戏状态
  state : "ready" ,

  //是否已经领过金币了
  isExchange : false ,
  //领取的金币是多少
  isExchangeGold : 0 ,
  //是否已经分享过了
  isShared : false ,

  //总分
  score : 0 ,

  //兔子及障碍物的定位坐标
  initPost : {},
  //兔子默认的位置
  rabbitPost : "CENTER"  ,    //  CENTER LEFT RIGHT

  //user
  user : "" ,
  plat : "" ,
  phone : "" ,
  code : "" ,
  activityId : "39da157fabc9115f4784221b7e432319" ,
  isDevice : false ,




  //界面初始化
  init : function(windowHeight){
    var self = this ;
    self.scale = windowHeight / self.height;
    self.loader = new LoaderSecen();
    self.loader.on('complete' , function(e){
      setTimeout(function(){
        self.loader.off("complete");
        self.initStage();
      },500);

    }.bind(self));
    self.loader.load();
    //开始dom的初始化
    cs.init(function(ua){
        if(ua.isApple){
          self.plat = "iPhone";
        }else{
          self.plat = "Android";
        }
    });
    //初始化交互信息
      HostSdk.init(function() { //获取客户端的信息
          HostSdk.getInfo({
              successCallback: function(info) {
                  info = JSON.parse(info);
                  self.user = info.userId;
                  self.isDevice = true ;
                  self.getShareCurrent();
              }
          });
      });
  } ,
  //初始化舞台
  initStage : function(){
    //console.log(this.width,this.height);
      this.stage = new Hilo.Stage({
        renderType:'canvas',
        width: this.width,
        height: this.height,
        scaleX : this.scale,
        scaleY : this.scale
      });
      //添加到body
      document.body.appendChild(this.stage.canvas);
      //window.st =   this.stage.canvas;
      this.stage.canvas.style.left = ( window.innerWidth - (this.width*this.scale) ) / 2 + "px" ,
      //启动主定时器
      this.ticker = new Hilo.Ticker(60);
      this.ticker.addTick(Hilo.Tween);
      this.ticker.addTick(this.stage);
      this.ticker.start();

      //添加ticker的定时器
      this.ticker.timeout = function(cb, duration){
          var that = this;
          var targetTime = new Date().getTime() + duration;
          var tickObj = {
              tick:function(){
                  var nowTime = new Date().getTime();
                  var dt = nowTime - targetTime;
                  if(dt >= 0){
                      that.removeTick(tickObj);
                      cb && cb();
                  }
              }
          };
          that.addTick(tickObj);
          return tickObj;
      };

      this.ticker.interval = function(cb, duration){
          var that = this;
          var targetTime = new Date().getTime() + duration;
          var tickObj = {
              tick:function(){
                  var nowTime = new Date().getTime();
                  var dt = nowTime - targetTime;
                  if(dt >= 0){
                      if(dt < duration){
                          nowTime -= dt;
                      }
                      targetTime = nowTime + duration;
                      cb && cb();
                  }
              }
          };
          that.addTick(tickObj);
          return tickObj;
      };

      this.ticker.clear = function(tickObj){
          this.removeTick(tickObj);
      };
      this.ticker._tick=function(){
          if(this._paused) return;
          var startTime = +new Date(),
              deltaTime = startTime - this._lastTime,
              tickers = this._tickers.slice();

          //calculates the real fps
          if(++this._tickCount >= this._targetFPS){
              this._measuredFPS = 1000 / (this._tickTime / this._tickCount) + 0.5 >> 0;
              this._tickCount = 0;
              this._tickTime = 0;
          }else{
              this._tickTime += startTime - this._lastTime;
          }
          this._lastTime = startTime;

          for(var i = 0, len = tickers.length; i < len; i++){
              tickers[i].tick(deltaTime);
          }
      };

      //开启点击事件
      this.stage.enableDOMEvent([Hilo.event.POINTER_START,Hilo.event.POINTER_MOVE,Hilo.event.POINTER_END],true);

      //初始化开始游戏界面
      this.initStartScene();
      //初始化游戏中界面
      this.initPlaying();

      //舞台更新
      this.stage.onUpdate = this.onUpdate.bind(this);



      // //测试
      // this.gameOver(12);
      // this.PlayingScene.visible = false ;
      // this.StartScene.visible = false ;
  } ,
  initStartScene : function(){
    var self = this;
    //开始场景
    self.StartScene = new StartScene({
      width : self.width ,
      height : self.height ,
      startBg : self.loader.startBg ,
      musicCurrent : self.musicCurrent,
      text : self.loader.text ,
      homeUi : self.loader.homeUi ,
      startGame : self.startGame
    }).addTo(self.stage);

    //绑定开始游戏按钮
    self.StartScene.getChildById('startBtn').on(Hilo.event.POINTER_START , function(e){
      e._stopped = true;
      e.preventDefault();
    }).on(Hilo.event.POINTER_END, function(e){
        self.startGame(e);
    });

    //添加全局音乐按钮
    //添加音乐按钮
    self.musicBtn = new Hilo.Bitmap({
      id : "musicBtn" ,
      image : self.loader.text ,
      width : 54,
      height : 55 ,
      rect : [380,371,54,55] ,
      x : this.width  - 110 ,
      y : 25,
      scaleX : 1.5 ,
      scaleY : 1.5
    });
    this.stage.addChild(self.musicBtn);
    if(!self.musicCurrent){
      cs.musicOFF();
      self.musicBtn.setImage(self.loader.text , [442,371 ,54,55] );
    }else{
      cs.musicON();

    }
    //音乐按钮
    self.musicBtn.on(Hilo.event.POINTER_START , function(e){
      e._stopped = true;
      e.preventDefault();
      //console.log("sssss");
    }).on(Hilo.event.POINTER_END, function(e){
      try {
        if(self.musicCurrent){
          self.musicBtn.setImage(self.loader.text , [442,371 ,54,55] );
          self.musicCurrent = false ;
          cs.musicOFF();
        }else{
          self.musicBtn.setImage(self.loader.text , [380,371 ,54,55] );
          self.musicCurrent = true ;
          cs.musicON();
        }
      } catch (err) { console.log(err); }
    });

  },
  initPlaying : function(){
    var self = this ;
    self.size = Math.floor((self.width - self.lawn*2) / 3);
    self.initPost = {
        left : Math.round(self.lawn + (self.size - 142)/2),
        center : self.width / 2 - 71 ,
        right : Math.round(self.width - self.lawn - (self.size - 40))
    } ;

    self.PlayingScene = new PlayingScene({
        width : self.width ,
        height : self.height ,
        dead : self.DEAD ,
        atlas: this.loader.rabbitAtlas,
        initPost : self.initPost,
        ground : self.loader.ground ,
        monster : self.loader.monster ,
        textScene : self.loader.textScene,
        rabbitPost : self.rabbitPost,
        ticker : self.ticker,
        event : self.loader.monster
    }).addTo(self.stage);
    self.PlayingScene.visible = false ;
    self.stage.addChild(self.musicBtn);
    //移动背景
    Hilo.Tween.to(self.PlayingScene.getChildById('pillarLeft') , { y : 0 } , {duration : self.PlayingScene.speed , loop : true});
    Hilo.Tween.to(self.PlayingScene.getChildById('pillarRight') , { y : 0 } , {duration : self.PlayingScene.speed , loop : true});




    //添加点击事件
    self.PlayingScene.on(Hilo.event.POINTER_START , function(e){
      e._stopped = true;
      e.preventDefault();

      //text.show(self.rabbitPost)

      var clickX = e.stageX ;
      var width = self.width ;
      //点右边
      if( clickX > width/2 ){
          if( self.rabbitPost != "RIGHT"){
            //console.log(1)
            var GoStr = self.rabbitPost == "CENTER" ? "RIGHT" : "CENTER";
            self.rabbitMoveAnimate( self.PlayingScene.getChildById('rabbit')  , GoStr.toLocaleLowerCase() );
            self.rabbitPost = GoStr;
          }
      //点左边
      }else{
        if( self.rabbitPost != "LEFT"){
          //console.log(3)
          var GoStr2 = self.rabbitPost == "CENTER" ? "LEFT" : "CENTER";
          self.rabbitMoveAnimate( self.PlayingScene.getChildById('rabbit')  , GoStr2.toLocaleLowerCase() );
          self.rabbitPost = GoStr2;
        }
      }
      //传入游戏中更新兔子的当前位置
      self.PlayingScene.rabiitPostUpdate(self.rabbitPost);
      //console.log(self.rabbitPost)
    }).on(Hilo.event.POINTER_END, function(e){
    });
  } ,
  rabbitMoveAnimate : function( event , curent ){
      var self = this;
       //实际移动的值
      var post = 0 ;

      var current = -1;

      switch ( curent ){
        case "left" :
          current = 0;
          post = self.initPost.left-20;
          break ;
        case "center" :
          current = 1;
          post =  self.initPost.center ;
          break ;
        case "right" :
          current = 2;
          post =  self.initPost.right-20 ;
          break ;
      }

      ///post = self.size * current + (self.size-142)/2 + self.lawn;

      Hilo.Tween.to(event, { x : post } , {duration : self.PlayingScene.rabbitSpeed });
  },
  startGame : function(e){
      var self = this ;

      //设置本局最大金币数
      self.setMaxScore();

      //判断是否第一次进入游戏
      var cookie = cs.getCookie("showTips");
      if(cookie == null){
        cs.show_tips();
        cs.setCookie("showTips" , "true" , 7);
      }

      try {
          activity.ac("点击开始游戏");   // 记录登录按钮点击次数
      } catch (err) { console.log(err);}
      self.StartScene.visible = false ;
      self.PlayingScene.visible = true ;
      self.musicBtn.visible = true ;
      self.state = "playing" ;
      //生成障碍开始游戏或者可获得分数
      self.PlayingScene.generate();
  } ,
  gameOver : function(score ){
      var self = this ;
      self.score = score ;
      self.gameOverScene = new GameOverScene({
        width : self.width ,
        height : self.height ,
        startBg : self.loader.startBg,
        textScene : self.loader.textScene ,
        text : self.loader.text ,
        gameOverdef : self.loader.gameOverdef ,
        text2 : self.loader.text2 ,
        light : self.loader.light ,
        ticker : self.ticker,
        numberGlyphs : self.loader.numberGlyphs,
        number2Glyphs : self.loader.number2Glyphs,
        score : score
      }).addTo(self.stage);
      self.stage.addChild(self.musicBtn);

      function Countdown(ele, post) {
        var disabled = false ;
        var defaults = false ;
          if (!ele.defaults) {
              ele.time = 60;
              ele.style.width = "100px";
          }
          post(function () {
            if (disabled) return;
              defaults = true ;
              disabled = true;
              ele.innerHTML = ele.time + '秒后重新获取';
              ele.timer = setInterval(function () {
                  ele.time--;
                  ele.innerHTML = ele.time + '秒后重新获取';
                  if (ele.time <= 0) {
                      clearInterval(ele.timer);
                      ele.time = 60;
                      ele.innerHTML = "获取验证码" ;
                      ele.style.width = "90px";
                      disabled = false;
                      defaults = false ;
                  } //
              }, 1000);
          });
      }

      //绑定兑换金币游戏按钮
      self.gameOverScene.getChildById('subBtn').on(Hilo.event.POINTER_START , function(e){
        e._stopped = true;
        e.preventDefault();
      }).on(Hilo.event.POINTER_END, function(e){
          var nowDay = new Date() * 1;
          var endTime = new Date('sep 17,2016,00:00') * 1;
          if(nowDay >= endTime){
            text.show("活动已经结束，兑换失败！");
            return;
          }
          cs.showLog();
          activity.ac("兑换金币");   // 记录兑换金币按钮点击次数
          //console.log("兑换金币");
          //self.gameOverScene.getChildById("formViewBg").visible = true ;
          if(self.user === ""){
            cs.show("submit");
            cs.hideLog();
            // 取验证码
            var current = false ;
            document.querySelectorAll("#getCode")[0].onclick = function(){
                cs.showLog();
                var phone = document.querySelectorAll("#phone")[0].value.replace(/(^\s*)|(\s*$)/g, "");
                  if (phone === '') {
                      text.show('手机号不能为空！');
                  } else if (!/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(phone)) {
                      text.show('手机号不合法或不支持，请重新输入！');
                  } else {
                    if(current){
                      cs.hideLog();
                      return ;
                    }

                      // 开始倒计时
                      Countdown(this, function (count) {
                          var PhoneUrl = host + '/WebApi/Phone/SendPhone?phone=' + phone;
                          cs.ajax(PhoneUrl , "GET", function(data){
                            var data2 = JSON.parse(data);
                          //  console.log(data2);
                            if (!(data2.status)) {
                                text.show(data2.message);
                                return;
                            }else {
                               current = true ;
                               count();
                            }
                          });
                      });
                  }
                  cs.hideLog();
              };

            // 提交登录请求
            setTimeout(function(){
            document.querySelector(".submit").onclick = function(){
              cs.showLog();
              activity.ac("点击登录");
              self.phone = document.querySelectorAll("#phone")[0].value.replace(/(^\s*)|(\s*$)/g, "");
              self.code = document.querySelectorAll("#codeYZM")[0].value.replace(/(^\s*)|(\s*$)/g, "");
              if (self.phone === '') {
                  text.show('手机号不能为空');
              } else if (!/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(self.phone)) {
                  text.show('手机号不合法或不支持');
              } else if (self.code === '') {
                  text.show('验证码不能为空');
              } else {
                Ajax.post(  host +"/WebApi/Account/LoginByPhoneAndCode")
                    .data({
                        Phone: self.phone,
                        Code: self.code,
                        Platform: self.plat,
                    })
                    .json()
                    .success(function(result) {
                      //console.log(result);
                      cs.hideLog();
                      //兑换成功
                      if(result.status){
                        activity.ac("登录成功");
                        self.user = result.data.userID;
                        //登录成功
                        self.getShareCurrent();
                        cs.hide("submit");
                        if(!self.isExchange){
                              //当未领取金币时领取金币
                              self.receiveGold(score,true);
                        }else{
                              //当已经领取金币时 吧金币设成已经领取的金币
                              self.receiveGold(score,false);
                        }
                      }else if(result.code == "1002"){
                        text.show("您的手机号还没注册，请输入密码完成注册！");
                        activity.ac("未注册，进行注册");
                        //未注册显示注册窗口
                        cs.hide("submit");
                        cs.show("submitReg");
                      }else{
                        text.show(result.message);
                      }
                    })
                    .send();
              }
              cs.hideLog();
            };
          },500);
            cs.$(".submit")[0].onclick = function(e){
              e.preventDefault();
              //判断是否是客户端
            };

            //绑定关闭按钮
            cs.$(".hide_but")[0].onclick = function(){
              cs.hide("submit");
            };
          }else{


            if(!self.isExchange){
                  //当未领取金币时领取金币
                  self.receiveGold(score,true);
            }else{
                  //当已经领取金币时 吧金币设成已经领取的金币
                  self.receiveGold(score,false);
            }
            //已经登录直接提交
            self.getShareCurrent();
          }
      });

      //
      document.querySelector(".submitReg").onclick = function(){
        cs.showLog();
        var pasw  = document.querySelectorAll(".password")[0].value.replace(/(^\s*)|(\s*$)/g, "");
        var surePasw = document.querySelectorAll(".surePassword")[0].value.replace(/(^\s*)|(\s*$)/g, "");
        if(pasw === "" || surePasw === ""){
          text.show("请输入您的初始密码！");
        }else{
          if(pasw === surePasw){
              self.registered(self.phone,pasw,self.code);
          }else{
            text.show("两次密码不一致，请重新输入！");
            cs.hideLog();
          }
        }
      };
      //绑定兑换金币游戏按钮
      self.gameOverScene.getChildById('rePlayBtn').on(Hilo.event.POINTER_START , function(e){
        e._stopped = true;
        e.preventDefault();
      }).on(Hilo.event.POINTER_END, function(e){
          activity.ac("不服再战");   // 记录在玩一次按钮点击次数
          //console.log("不服再战");
          self.replayGame();
      });

      //绑定去看书
      self.gameOverScene.getChildById('readContainer').getChildById('goReadBtn').on(Hilo.event.POINTER_START , function(e){
        e._stopped = true;
        e.preventDefault();
      }).on(Hilo.event.POINTER_END, function(e){
          activity.ac("去看书");   // 记录去看书按钮点击次数
          //console.log("去看书");
          window.location.href = "http://www.sxyj.net/" ;
      });

      //绑定去分享
      self.gameOverScene.getChildById('shareContainer').getChildById('shareBtn').on(Hilo.event.POINTER_START , function(e){
        e._stopped = true;
        e.preventDefault();
      }).on(Hilo.event.POINTER_END, function(e){
          activity.ac("分享加金币");   // 记录去去分享按钮点击次数
          //console.log("去分享");
          HostSdk.share(
                {
                    title: "浓浓中秋意，惓惓书香情，“吃月饼”参抢500w金币，手慢无！",
                    description: " " ,
                    url: "http://d.ireadercity.com/WebResource/page/spa/moonCake.html",
                    icon: "http://d.ireadercity.com/WebResource/page/spa/img/moonCake/shareImg2.jpg" ,
                    platforms: "",
                    cancelCallback: function(){
                        text.show("用户取消了分享");
                    },
                    successCallback: function(platform){
                        //text.show("分享成功！")
                        self.gameOverScene.hideShareView();
                        //分享加金币
                        if(!self.isShared){
                          cs.showLog();
                          Ajax.post(host + "/WebApi/MidAutumnActivity/Share")
                              .data({
                                activityId : self.activityId ,
                                userId : self.user
                              })
                              .json()
                              .success(function(result) {
                                cs.hideLog();
                                if(result.status){
                                  text.show("分享成功！金币已经添加至您的账户！");
                                  activity.ac("分享成功");
                                }else{
                                  text.show(result.message);
                                }
                              })
                              .send();
                        }

                    },
                    errorCallback:function(msg){
                        text.show(msg);
                    }
                }
            );
      });

  },
  onUpdate : function(){
      var self = this ;
      if(self.state == "ready"){
          return ;
      }
      if(!(self.PlayingScene.DEAD)){
        //console.log("游戏结束！！！");
      }else{
        if(self.PlayingScene.checkCollision(self.PlayingScene.getChildById('rabbit'))){
            //console.log("碰到了！！！");
            self.PlayingScene.DEAD = false ;
            self.PlayingScene.removeChildFunc();
            self.gameOver(self.PlayingScene.score);
        }
      }
  } ,
  //重新开始游戏
  replayGame : function(){
    var self = this ;

    //设置本局最大金币数
    //self.setMaxScore();

    activity.ac("开始挑战");   // 记录登录按钮点击次数
    self.StartScene.visible = false ;
    self.PlayingScene.visible = true ;
    self.musicBtn.visible = true ;
    self.state = "playing" ;
    self.rabbitPost = "CENTER" ;
    self.PlayingScene.getChildById('rabbit').x =  self.initPost.center ;
    self.gameOverScene.visible = false ;
    //生成障碍开始游戏或者可获得分数
    self.PlayingScene.generate();
  },
  setMaxScore : function(){
    var self = this ;
    var num = self.PlayingScene.random(100,200);
    //设置本局最大金币数
    self.PlayingScene.maxScore = 300;
    //text.show("可获得的最多金币为：" + self.PlayingScene.maxScore  + "\n" + "本消息为测试提示消息，测试完毕将不再显示！");
    //设置本局的时间速度差
    self.PlayingScene.speedDifference = Math.round(1800/num);
  } ,

  //获取是否已经分享
  getShareCurrent : function(){
    cs.showLog();
    var self = this ;
    //分享api
    var shareApi = host + "/WebApi/MidAutumnActivity/FindAward";

    Ajax.get(shareApi)
        .data({
          activityId : self.activityId ,
          userId : self.user
        })
        .json()
        .success(function(result) {
          cs.hideLog();
          if(result.status){
              if(result.data.hasShared){
                self.isShared = true ;
              }
              //是否已经领过金币了
              if(result.data.award && result.data.award.coin){
                self.isExchange = true ;
                self.isExchangeGold = result.data.award.coin;
              }
          }
        })
        .send();
  } ,

  receiveGold : function(score , isExchange ){
    var self = this ;
    cs.showLog();
    if(isExchange){
      Ajax.post(host + "/WebApi/MidAutumnActivity/DrawAward")
          .data({
              activityId : self.activityId ,
              userId : self.user ,
              Coin : score
          })
          .json()
          .success(function(result) {
              cs.hideLog();
              if(result.status){
                if(self.isDevice){
                  self.gameOverScene.showShareView(true);
                }else{
                  self.gameOverScene.showShareView(false);
                }
                activity.ac("兑换金币成功");
                self.isExchange = true ;
              }else{
                if(result.message === "你已领取奖品"){
                    self.isExchangeTrue();
                    return ;
                }
                text.show(result.message);
              }
          })
          .send();
    }else{
      self.isExchangeTrue();
      cs.hideLog();
    }

  } ,
  isExchangeTrue : function(){
    var self = this ;
    if(self.isDevice){
      self.gameOverScene.showShareView(true);
      self.gameOverScene.getChildById('shareContainer').getChildById('bestLabel22').setText("x"+self.isExchangeGold);
      self.gameOverScene.getChildById('shareContainer').getChildById('jjText2').text = "您已经领取过"+ self.isExchangeGold +"金币";
    }else{
      self.gameOverScene.showShareView(false);
      self.gameOverScene.getChildById('readContainer').getChildById('bestLabel2').setText("x"+self.isExchangeGold);
      self.gameOverScene.getChildById('readContainer').getChildById('jjText').text = "您已经领取过"+ self.isExchangeGold +"金币";
    }
    text.show("您已经领取过奖品了");
  } ,
  registered : function(phone , pasw , code){
    var self = this ;
    Ajax.post(host + "/WebApi/Account/RegisterByPhone")
        .data({
          Phone: phone,
          Password: pasw,
          NickName: phone,
          Platform: self.plat,
          Code: code
        })
        .json()
        .success(function(result) {
            cs.hideLog();
            if(result.status){

              //注册成功
              activity.ac("注册成功");
              if(!self.isExchange){
                    cs.hide("submitReg");
                    //当未领取金币时领取金币
                    self.receiveGold(self.score,true);
              }else{
                    //当已经领取金币时 吧金币设成已经领取的金币
                    self.receiveGold(self.score,false);
              }
            }else{
              text.show(result.message);
            }
        })
        .send();
  }
};



export default csGame;
