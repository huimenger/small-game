import * as csGame from "./moonCake/Game.js";


 window.onload = function(){
     document.addEventListener('touchmove', function(e) {
       e.preventDefault();
     });
     var windowHeight = window.innerHeight;
   csGame.default.init(windowHeight);
};

