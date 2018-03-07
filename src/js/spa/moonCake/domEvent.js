import * as query from "../../commons/query";
import * as browser from "../../commons/browser";

  console.log(browser);

  var cs = {
      $ : function( str ){
          return document.querySelectorAll(str);
      } ,
      init : function(call){
        // 判断平台的工具方法
        var ua = navigator.userAgent;
        var clientTool = {
            // 是否是Android
            isAndroid: ua.toLowerCase().indexOf("android") > -1 || ua.toLowerCase().indexOf("linux") > -1,
            // 是否是iPad
            isIpad: ua.indexOf("iPad") > -1,
            // 是否是iPhone
            isIphone: ua.indexOf("iPhone") > -1,
            // 是否在苹果设备
            isApple: false
        };
        clientTool.isApple = (clientTool.isIphone === true || clientTool.isIpad === true);


        this.audio = (function(audio){
          audio.loop = true;
          audio.src = (function(){
            if(clientTool.isApple){
              return 'http://d.ireadercity.com/WebResource/page/spa/audio/moonCake/bg_music.mp3';
            }
            return 'http://d.ireadercity.com/WebResource/page/spa/audio/moonCake/bg_music.wma';
          })();
          document.body.appendChild(audio);
          return audio;
        })(document.createElement('audio'));

        call(clientTool);
      },
      //渐隐
      fadeLimit : function(obj,start,end,cur){
          obj.style.display = "none";
      },
      show : function( str , bg ){
          var warp = this.$(".showPup")[0];
          var list = this.$(".showPup .content .list");
          warp.querySelectorAll(".bg")[0].style.display = "block" ;
          this.hideAll(list);

          warp.style.display = "block" ;
          switch ( str ){
            case "rule" :
              list[0].style.display = "block";
              break;
            case "submit" :
              list[1].style.display = "block";
              break;
            case "submitReg" :
              list[2].style.display = "block";
              break;
          }
          // if(bg){
          //   warp.querySelectorAll(".bg")[0].style.display = "none" ;
          // }
      } ,
      hide : function(){
        var warp = this.$(".showPup")[0];
        warp.style.display = "none" ;
      },
      hideAll : function( dom ){
          for(var i = 0 ; i < dom.length ; i++){
              dom[i].style.display = "none" ;
          }
      },
      musicON : function(){
        this.audio.play();
      },
      musicOFF : function(){
        this.audio.pause();
      },
      getAdressUid : function ( name ) {
        var agruments = query.getQueryParams(window.location.href);
        return agruments[name];
    },
    ajax : function (url,state, onsuccess)
      {
          var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
          xmlhttp.open(state, url, true);
          xmlhttp.onreadystatechange = function ()
          {
              if (xmlhttp.readyState == 4)
              {
                  if (xmlhttp.status == 200)
                  {
                      onsuccess(xmlhttp.responseText);
                  }
                  else
                  {
                      alert("AJAX服务器返回错误！");
                  }
              }
          }
          //不要以为if (xmlhttp.readyState == 4) {在send之前执行！！！！
          xmlhttp.send(); //这时才开始发送请求。并不等于服务器端返回。请求发出去了，我不等！去监听onreadystatechange吧！
      },
      showLog : function(){
        document.querySelectorAll(".loadingWarp")[0].style.display = "block";
      } ,
      hideLog : function(){
        document.querySelectorAll(".loadingWarp")[0].style.display = "none";
      } ,
      show_tips: function(){
        document.querySelectorAll(".tips_ts")[0].style.display = "block";
        setTimeout(function(){
          document.querySelectorAll(".tips_ts")[0].style.display = "none";
        } , 2000 );
        document.querySelectorAll(".tips_ts")[0].onclick = function(){
          this.style.display = "none";
        };
      } ,
      setCookie : function (name, value, exdays) {
          var d = new Date();
          d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
          var expires = "expires=" + d.toUTCString();
          document.cookie = name + "=" + value + "; " + expires;
      },
      //获取cookie、
      getCookie : function (name) {

          var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
          if (arr != null)
              return unescape(arr[2]);
          return null;
      }
  };
  export default cs;
