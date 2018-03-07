/**
 * 加载条共用模块，用于显示加载动画。
 */
define(["jquery"], function ($) {
    var tool = {
        // 底部加载条
        bottom: {
            show: function (time) {
                // 默认60秒
                time = time ? time : 60000;
                tool.bottom.hide();
                var el = $('<div id="page_bottom_loader" style="position: fixed; bottom: 0px; left: 0px; right: 0px; height: 35px; background: rgba(0,0,0,0.7); padding: 5px; text-align: center; color: #FFF; font-size: 16px; "><img style="height: 25px; padding-right: 5px;" src="https://d.ireadercity.com/WebResource/webapp/resources/v3/img/loading2.gif" /><span style="vertical-align: 35%;">正在加载</span></div>');
                $("body").append(el);
                setTimeout(function () {
                    el.remove();
                }, time);
            },
            hide: function () {
                $("#page_bottom_loader").remove();
            }
        }
    };
    return tool;
});