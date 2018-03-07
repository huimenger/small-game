define(["jquery", "commons/Query", "commons/Browser"], function ($, query, Browser) {
    var common = {
        query: query,
        ajax: {
            show: function (text) {
                var loadTextDom = $("#ajax_loadding .text");
                loadTextDom.html(text);
                $("#ajax_loadding").show();
            },
            hide: function () {
                $("#ajax_loadding").hide();
            }
        },
        page: {
            show: function (text) {
                var loadTextDom = $("#page_loadding .title");
                loadTextDom.html(text);
                $("#page_loadding").show();
            },
            hide: function () {
                $("#page_loadding").hide();
            }
        },
        isWeixin: Browser.isWeixin,
        getDeviceType: function () {
            var u = navigator.userAgent;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
            var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            if (isAndroid) {
                return "Android";
            } else if (isIOS) {
                return "iPhone";
            } else {
                return "";
            }
        }
    };
    return common;
});