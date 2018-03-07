/**
 * Created by 暖炉先生 on 2016/12/13.
 * 一个touch的简易控件（待优化）
 * 根据滑动状态返回滑动方向对应的方法left,top,right,bottom 和 move（移动时）
 * 使用
 * let touch = new touchEvent(ele);
 * touch.left((x,y,isQuick)=>{})
 */

let touchBase = function ( el, cb ) {
    let startX = 0,         //点击的X坐标
        startY = 0,         //点击的Y坐标
        moveX = 0,          //移动时的X坐标（随着move改变）
        moveY = 0,          //移动时的Y坐标（随着move改变）
        startTime = null,   //手指按下的时间戳（用于判断是否快速滑动）
        endTime = null;     //手指弹开的时间戳
    function touchStart( event ) {
        let ev = event || window.event;
        ev.preventDefault();
        ev.stopPropagation();
        startTime = Date.now();
        startX = ev.touches[ 0 ].pageX - el.offsetLeft;
        startY = ev.touches[ 0 ].pageY - el.offsetTop;
        el.addEventListener( 'touchmove', touchMove );
        el.addEventListener( 'touchend', touchEnd );
    }
    //移动中
    function touchMove( event ) {
        let ev = event || window.event;
        ev.preventDefault();
        ev.stopPropagation();
        moveX = startX - ev.touches[ 0 ].pageX + el.offsetLeft;
        moveY = startY - ev.touches[ 0 ].pageY + el.offsetTop;
        cb.move && cb.move( moveX, moveY );
    }
    function touchEnd(ev) {
        var ev = ev || event;
        ev.stopPropagation();
        endTime = Date.now();
        let isQuick = (endTime - startTime) < 150;
        /**
         * 判断移动方向 根据当前移动的绝对值判断
         */
        if ( Math.abs( moveX ) > Math.abs( moveY ) ) {
            if ( moveX > 0 ) {
                cb.left && cb.left( moveX, moveY, isQuick );
            } else {
                cb.right && cb.right( moveX, moveY, isQuick );
            }
        } else if ( Math.abs( moveX ) < Math.abs( moveY ) ) {
            if ( moveY > 0 ) {
                cb.top && cb.top( moveX, moveY, isQuick );
            } else {
                cb.bottom && cb.bottom( moveX, moveY, isQuick );
            }
        } else {
            console.log( "未移动" );
        }
        el.removeEventListener( 'touchmove', touchMove )
        el.removeEventListener( 'touchend', touchEnd )
    }

    el.addEventListener( 'touchstart', touchStart );
};


class touchEvent {
    constructor( el ) {
        this.callback = {};
        touchBase( el, this.callback );
    }

    /**
     * 回调方法
     * @param { Function } callback 所有left,top,bottom,right回调方法均携带当前弹起的x,y坐标和一个是否快速滑动的标识
     */

    top( callback ) {
        this.callback.top = callback;
    }

    bottom( callback ) {
        this.callback.bottom = callback;
    }

    left( callback ) {
        this.callback.left = callback;
    }

    right( callback ) {
        this.callback.right = callback;
    }

    move( callback ) {
        this.callback.move = callback;
    }
}


export default touchEvent;