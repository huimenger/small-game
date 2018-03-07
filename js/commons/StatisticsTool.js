// 统计工具模块
//==>commons/Query=./Query
//==>commons/Browser=./Browser
define(["commons/Query", "jquery", "commons/Browser"], function (query, $, browser) {
    var toolGetCookie = function (key) {
        var reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
        var arr = document.cookie.match(reg);
        if (arr) {
            var value = unescape(arr[2]);
            return value;
        }
        return null;
    }

    var toolSetCookie = function (key, value) {
        document.cookie = key + "=" + value + ";path=/";
    }

    var tool = {
        // 开始使用百度统计代码
        start: function (accountCode) {
            // 默认统计账号
            if (!accountCode) accountCode = "7678749a3ef3b8c13d4d5ba34a8c707f";
            // 统计生效代码
            (function () {
                var hm = document.createElement("script");
                hm.src = "//hm.baidu.com/hm.js?" + accountCode;
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
            })();

            // CNZZ 统计
            var head = document.getElementsByTagName("head").item(0);
            var sc = document.createElement("script");
            sc.type = "text/javascript";
            sc.src = "https://s95.cnzz.com/z_stat.php?id=1259187207&web_id=1259187207";
            sc.onload = function () {
                console.log("CNZZ加载成功");
            }
            head.appendChild(sc);
        },
        // 设置渠道访客类型
        setApp: function (appid) {
            window._hmt = window._hmt || [];
            window._czc = window._czc || [];

            var u = navigator.userAgent;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
            var isiOs = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            var device = isAndroid ? "android" : (isiOs ? "ios" : "web");

            window._hmt.push(["_setCustomVar", 1, "visitor", appid + "_" + device, 1]);

            window._czc.push(["_setCustomVar", "访客来源", appid + "_" + device, 1]);
        },
        getAppId: function () {
            // 获取URL参数中是否有appid（渠道号）
            var appid = query.get("appid");

            if (!appid) {
                // 从页面中获取appid
                appid = $("[data-appid]").attr("data-appid");
            } else {
                var rf = document.referrer || "";
                // 百度搜索
                if (rf.indexOf("baidu") > -1) appid = "baiduSearch";
                    // 360好搜
                else if (rf.indexOf(".so.com") > -1) appid = "360Search";
                    // 搜狗搜索
                else if (rf.indexOf(".sogou.com") > -1) appid = "sogouSearch";
                    // 神马搜索
                else if (rf.indexOf(".sm.cn") > -1) appid = "shenmaSearch";
            }

            if (appid) {
                // 如果有渠道号，记录在本次会话中
                toolSetCookie("appid", appid);
            }

            // 从会话Cookie中取得渠道号
            appid = toolGetCookie("appid");
            return appid;
        },
        //行为统计
        track: function (trackName, channelName, actionName) {
            window._czc.push(["_trackEvent", trackName, channelName, actionName]);
        },
        getSubAppId: function () {
            // 获取URL参数中是否有aid（子渠道号）
            var aid = query.get("A_ID") || query.get("aid");

            if (!aid) {
                // 从页面中获取appid
                aid = $("[data-aid]").attr("data-aid");
            }

            if (aid) {
                // 如果有渠道号，记录在本次会话中
                toolSetCookie("aid", aid);
            }

            // 从会话Cookie中取得渠道号
            aid = toolGetCookie("aid");
            return aid;
        }

    };
    var appid = tool.getAppId();
    var aid = tool.getSubAppId();
    var tongjiAccount = "7678749a3ef3b8c13d4d5ba34a8c707f";

    if (appid) {
        tool.setApp(appid);
        // 话语科技的渠道号（是个坑，要单独的账号统计）
        if (appid.indexOf("huayu") !== -1) {
            tongjiAccount = "621b0e4682e81997f6e4d6c002abf88e";
        }
    } else {
        tool.setApp("shuxiang");
    }

    tool.start(tongjiAccount);
    return tool;
});
