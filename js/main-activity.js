// 要合并的JS模块
require([
    "plugins/pageResponse.js"
], function () { });

var resourceLoaded = false;
var scriptLoaded = false;
require(["jquery", "commons/ResLoader", "commons/ActivityCommon", "commons/StatisticsTool"], function ($, loader, common, stat) {
    // 自动检测页面模型JS
    var models = $("[data-model]");
    models.each(function () {
        var $model = $(this);
        var initModelName = $model.attr("data-model");
        if (initModelName) {
            require([initModelName], function (model) {
                (typeof (model.init) == "function" && model.init());
            });
        }
    });

    var loadComplete = function () {
        if (scriptLoaded && resourceLoaded) {
            common.page.hide();
            // 检测页面是否有初始化函数
            if (typeof (init) == "function") {
                init($, common);
                loadComplete = function () { };
            }

            var page = $("[data-design]");
            if (page.length > 0) {
                var width = page.attr("data-design");
                var designHeight = 0;
                if (width.indexOf(",") !== -1) {
                    var s = width.split(",");
                    width = parseInt(s[0]);
                    designHeight = parseInt(s[1]);
                }
                var mode = page.attr("data-design-mode");
                if (!mode) {
                    mode = "auto";
                }
                var resize = function () {
                    var obj = {
                        selectors: '#page_content',
                        mode: '' + mode,
                        width: '' + width
                    };
                    if (designHeight > 0) obj.height = designHeight;
                    pageResponse(obj);
                };
                $(window).resize(resize);
                window.onorientationchange = resize;
                resize();
            }
        }
    };

    // 载入JS资源
    if (typeof (scripts) != "undefined" && scripts instanceof Array) {
        common.page.show("载入脚本");
        require(scripts, function () {
            scriptLoaded = true;
            loadComplete();
        });
    } else {
        scriptLoaded = true;
    }

    // 载入资源
    if (typeof (resource) != "undefined" && resource instanceof Array) {
        (function () {
            var count = 0;
            for (var i = 0; i < resource.length; i++) {
                var res = resource[i];
                loader.loadImage(res, function (img) {
                    count++;
                    common.page.show("载入图片" + count + "/" + resource.length);
                    if (count == resource.length) {
                        resourceLoaded = true;
                        loadComplete();
                    }
                });
            }
        })();
    } else {
        resourceLoaded = true;
    }

    loadComplete();
});