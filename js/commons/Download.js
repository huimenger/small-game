// 这个模块用于下载APP客户端
define(["jquery", "commons/Browser", "commons/Query", "commons/StatisticsTool", "eui/Toast"], function ($, browser, query, stat, toast) {
    var down = {
        // APP下载链接
        downloadUrl: {
            // Android普通包
            android: "http://andfls.qiniudn.com/AIReader.apk",

            // Ios AppStore
            ios: "https://itunes.apple.com/cn/app/shu-xiang-yun-ji-xiao-shuo/id535742398?mt=8",

            // App应用宝地址
            yingyongbao: "http://a.app.qq.com/o/simple.jsp?pkgname=com.ireadercity",

            // VIVO下载地址
            vivo: "http://info.appstore.vivo.com.cn/detail/50657?source=7",

            // Android 万年历包
            androidWnl: "http://7d9rh8.com2.z0.glb.qiniucdn.com/AIReader_wnl.apk"
        },

        // 下载APP
        download: function () {
            // 判断当前的平台
            var platform = browser.isApple ? "iPhone" : "Android";

            // 获取当前页面上是否有bookId
            var bookId = query.get("bookId") ? query.get("bookId") : "";

            var appId = "";

            var idfa = "";

            var downUrl = "";

            // 如果是VIVO渠道
            if (stat.getAppId() && stat.getAppId().indexOf("vivo") > -1) {
                toast.showInfo("不支持下载");
                return;
                //downUrl = down.downloadUrl.vivo;  
            } else if (browser.isWechat) {
                // 在微信中使用应用宝下载地址
                downUrl = down.downloadUrl.yingyongbao;
            } else {
                if (browser.isApple) {
                    // 苹果中使用AppStore地址
                    downUrl = down.downloadUrl.ios;
                } else {
                    if (browser.isWannianli) {
                        // 万年历中Android地址使用万年历渠道
                        downUrl = down.downloadUrl.androidWnl;
                    } else {
                        downUrl = down.downloadUrl.android;
                    }
                }
            }

            // 记录IDFA和该IDFA对应的书籍id(如果存在)
            $.get("/WebApp/PartnerIdfa/CheckPartnerIdfa.html", {
                idfa: idfa,
                appId: appId,
                bookId: bookId,
                platform: platform
            }, function (json) {
                location.href = downUrl;
            }, "json");
        }
    };

    return down;
});