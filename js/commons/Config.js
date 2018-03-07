// 全局配置模块
define(["commons/Query"], function (query) {
    var config = {
        hideDownload: {
            //moji: true,
            //"moji-1": true,
            xfplay: true,
            xunfei: true
        },
        hideFollowWx: {
            //moji: true,
            //"moji-1": true,
            xfplay: true,
            xunfei: true
        },
        hideFloatFooter: {
            //moji: true,
            //"moji-1": true,
            xfplay: true,
            xunfei: true
        }
    };
    var tool = {
        // 是否显示下载
        isShowDownload: function (appid) {
            return !config.hideDownload[appid];
        },
        // 是否显示关注公众号
        isShowFollowWx: function (appid) {
            return !config.hideFollowWx[appid];
        },
        // 是否显示浮动下载条
        isShowFloatFooter: function (appid) {
            return !config.hideFloatFooter[appid];
        }
    };
    return tool;
});
