/**
 * Created by 暖炉先生 on 2016/12/14.
 * 简易计时器
 * @param {Object}  config 配置参数
 */


let Timer = (function () {

    function getTime( _me ) {
        let _newTime = Date.now() - _me.startTime;

        let completeTime = _me.config.format;
        let minute = _me.config.isMinute ? 99 : 60;
        let timeArr = (_newTime / 1000 + '').split( "." );
        let ms = timeArr[ 1 ];
        ms = Math.floor(ms / _me.config.msLength) + "";
        let mm = Math.floor( timeArr[ 0 ] / 60 ).toFixed(0) + '';
        let ss = timeArr[ 0 ] - mm * 60 + '';
        let hh = Math.floor( mm / 60 ) + '';
        if ( ms.length == 1 ) ms = 0 + "" + isNaN(ms) ? "00" : ms;
        if ( mm.length == 1 ) mm = 0 + "" + mm;
        if ( ss.length == 1 ) ss = 0 + "" + ss;
        if ( hh.length == 1 ) hh = 0 + "" + hh;
        completeTime = completeTime.replace( "ms", ms );
        completeTime = completeTime.replace( "mm", mm );
        completeTime = completeTime.replace( "ss", ss );
        completeTime = completeTime.replace( "hh", hh );
        return [ completeTime, _newTime ];
    }


    function Timer( config ) {
        this.config = {
            //默认格式
            format: config.format || "hh:mm:ss:ms",
            msLength: config.msLength || 1,
            isMinute: config.isMinute || false,
            //每次获取的时间 单位（ms）
            getTime: config.getTime || "1000",
            //回掉方法 返回计算后的时间 和一个当前时间与上一次的时间差
            callback: config.callback || function () {
            }
        };
        this.init();
    }
    let time ;
    Timer.prototype.init = function () {
        let _me = this;
        //获取开始时间用以计算
        _me.startTime = Date.now();

        _me.timer = setInterval( function () {
            time = getTime( _me );
            _me.config.callback( time[ 0 ], time[ 1 ] );
        }, _me.getTime );
    };

    Timer.prototype.stop = function () {
        let _me = this;
        clearInterval( _me.timer );
        return time;
    };

    return Timer;
})();

export default Timer;

