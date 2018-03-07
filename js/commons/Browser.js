define(function () {
    var ua = navigator.userAgent;
    var tool = {
        ua : ua,
        // 是否在微信中
        isWechat: ua.toLowerCase().indexOf("micromessenger") > -1,

        // 是否在微信中
        isWeixin: false,

        // 是否是Android
        isAndroid: ua.toLowerCase().indexOf("android") > -1 || ua.toLowerCase().indexOf("linux") > -1,

        // 是否是iPad
        isIpad: ua.indexOf("iPad") > -1,

        // 是否是iPhone
        isIphone: ua.indexOf("iPhone") > -1,

        // 是否在墨迹天气中
        isMoji: ua.indexOf("moji") > -1,

        // 是否在万年历中
        isWannianli: ua.indexOf("wnl") > -1,

        // 是否在中央天气预报
        isTianqi: ua.indexOf("") > -1,

        // 是否在苹果设备
        isApple: false,

        // 是否是移动设备
        isMobile: false,

        //判断是否在移动360浏览器
        is360: ua.indexOf("360SE") >= 0 || ua.indexOf("360EE") >= 0,

        //判断是否在移动UC浏览器
        isUc: ua.indexOf("UCBrowser") >= 0 || ua.indexOf("UCWEB") >= 0,

        //判断是否是谷歌浏览器
        isChrome: (ua.indexOf("Chrome") >= 0) && !(ua.indexOf("QQ") >= 0) && !(ua.indexOf("XiaoMi") >= 0),

        //判断是否是Safari浏览器
        isSafari: ua.indexOf("Safari") >= 0,

        //判断是否是QQ浏览器
        isQQ: ua.indexOf("QQ") >= 0 && !(ua.toLowerCase().indexOf("micromessenger") > -1),

        //判断是否是小米浏览器
        isXiaoMi: ua.indexOf("XiaoMi") >= 0
    };

    tool.isWeixin = tool.isWechat;
    tool.isApple = (tool.isIphone === true || tool.isIpad === true);
    tool.isMobile = (tool.isApple === true || tool.isAndroid === true);
    tool.platform = tool.isApple ? 'iPhone' : 'Android';
    return tool;
});