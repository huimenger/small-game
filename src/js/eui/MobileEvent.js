
/**
 * @Package [ touchMobileEvent ]
 * @description [兼容PC，移动端的手指鼠标事件]
 * @author [ @chuanS ]
 * @param  {[ Object ]} options 
*           1：承载初始化的各类设置 移动对象和回调方法 
*          	{
*          		ele : event ,  [ default : document.body ]  移动点击的目标 
*          		callback : {
*          			eventStart : function(content){},
*          			eventMove : function(content){},
*          			eventEnd : function(content,isMove){},
*          		}
*            	}
*           2：callback对象接受 3个方法的对象回调方法都接受一个content参数	 包含 ：
*          	{
*           	startTime : null ,		//点击开始时的时间搓
				endTime : null ,		//结束时的时间搓
				x : null ,				//点击时的X坐标（move时则为基于当前点移动的X坐标  以当前点击为原心坐标轴的值）
				y : null ,				//点击时的Y坐标（move时则为基于当前点移动的Y坐标  以当前点击为原心坐标轴的值）
				offsetL : null ,		//点击时的Y坐标（move时则为基于当前点移动的Y坐标  基于屏幕左上角）
				offsetT : null ,		//点击时的Y坐标（move时则为基于当前点移动的Y坐标  基于屏幕左上角）
			}
			3：在end事件中多一个是否是移动的参数  true:移动  false:点击
 * 
 */

function touchMobileEvent( options ){

	/*
		初始化参数
	*/
	//默认回调方法 参数与用户传入方法参数一致
	var call = {
		eventStart : function( content ){},
		eventMove : function( content ,isMove){},
		eventEnd : function( content , isMove ){}
	}
	this.ele = options.ele || document.body;
	this.callback = options.callback || call ;

	/*
		初始化事件相关参数
	*/
	this.isMove = false ;				//是否是移动
	this.isBegin = false ;
	
	/*
		初始化主体内容方法
	*/
	this.init(this.ele);

	/*
		保存开始时候的坐标	 	
	 */
	this.x = null ;
	this.y = null ;

	//默认参数值
	this.content = {
		startTime : null ,		//点击时间搓
		endTime : null ,
		x : null ,
		y : null  ,
		offsetL : null ,
		offsetT : null 
	};
}

/*
	初始化数据并绑定开始点击事件
 */
touchMobileEvent.prototype.init = function( ele ){
	var isPc = this.isPc();

	if(isPc){
		this.bindEvent(ele , "mousedown" , this.drag.bind(this) );
		this.bindEvent(ele , "mousemove" , this.drag.bind(this) );
		this.bindEvent(ele , "mouseup" , this.drag.bind(this) );
	}else{
		this.bindEvent(ele , "touchstart" , this.drag.bind(this) );
		this.bindEvent(ele , "touchmove" , this.drag.bind(this) );
		this.bindEvent(ele , "touchend" , this.drag.bind(this) );
	}
	//touchMobileEvent.call(this.drag);
};

touchMobileEvent.prototype.drag = function( event ){
	var self = this ;
	var ev = event ? event : window.event ;
	//兼容火狐谷歌
	var target = ev.target || ev.srcElement ;

	//阻止浏览器默认事件
	ev.preventDefault();

	switch ( ev.type ){
		case "mousedown" :
		case "touchstart" :
			this.isBegin = true ; 
			self.content.startTime = new Date() * 1;
			self.content.offsetL = self.x = self.content.x = ev.clientX || ev.touches[0].pageX ;
			self.content.offsetT = self.y = self.content.y = ev.clientY || ev.touches[0].pageY ;
			self.callback.eventStart && self.callback.eventStart(self.content);


			break ;
		case "mousemove" :
		case "touchmove" :
			if(!this.isBegin)  return ;
			//改变为滑动事件
			var pageX = self.content.offsetL = ev.clientX || ev.touches[0].pageX ;
			var pageY  = self.content.offsetT = ev.clientY || ev.touches[0].pageY ;
			//返回基于当前点移动的值  基于坐标轴的值
			self.content.x = pageX - self.x;
			self.content.y = pageY - self.y;

			//由于部分安卓机的限制触点就有值 所以加一个正负5来兼容
			if(self.content.x < -5 || self.content.x > 5 || self.content.y > 5 || self.content.y < -5){
				self.isMove = true ;
			}
			self.callback.eventMove && self.callback.eventMove(self.content);
			break ;
		case "mouseup" : 
		case "touchend" : 
			self.content.endTime = new Date() * 1;
			console.log(self.content);
			self.callback.eventEnd && self.callback.eventEnd(self.content,self.isMove);
			self.content.x = null ;
			self.content.y = null ;
			self.content.offsetL = null ;
			self.content.offsetT = null ;
			self.isMove = false ;
			this.isBegin = false ;
	};
};

//绑定事件  兼容IE浏览器
touchMobileEvent.prototype.bindEvent = function( node , type , func ){
	if(node.addEventListener){
		node.addEventListener(type , func , type );
	}else if(node.attachEvent){
		node.attachEvent("on"+type , func );
	}else{
		node["on" + type] = func ;
	}
};
/*
	判断是否是PC
 */
touchMobileEvent.prototype.isPc = function(){
    var ua = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (ua.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
};




export default touchMobileEvent;