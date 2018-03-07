// 要合并且执行的JS模块
require([
    "commons/StatisticsTool",
    "commons/Config",
    "commons/ImageScale",
    "components/Search",
    //"components/AddToDesktop",
    "models/Book/ReadHistoryStore",
    "filters/PastTime"
], function () { });

require(["jquery", "vue", "store"], function ($, vue, store) {

    window.onerror = function (errorMessage, script, lineNumber, columnNumber, errorObj) {
        var txt = new Date() + "\nmsg:" + errorMessage + "\nfile:" + script + "\nline:" + lineNumber + "\ncol:" + columnNumber + "\nerror" + JSON.stringify(errorObj);
        console.error(txt);
        store.set("onError", store.get("onError") + "\n\n" + txt);
    };

    var showHide = function () {
        var hides = $("[data-hide]");
        hides.each(function () {
            $(this).css("visibility", "visible");
        });
    }

    // 自动检测页面视图模型JS
    var vm = $("[data-vm]");
    if (vm && vm.length > 0) {
        // 定义了VM模型
        vm.each(function () {
            var $model = $(this);
            var initModelName = $model.attr("data-vm");
            if (initModelName) {
                require([initModelName], function (model) {
                    // 显示Body（全局CSS中对body初始样式设置为不显示，在这里显示，解决组件未生效时显示布局很乱的问题）
                    showHide();
                    console.log("使用自定义视图模型");
                });
            } else {
                showHide();
            }
        });
    } else {
        // 未定义VM模型，创建默认视图模型(使所有的自定义组件生效)
        var defaultVm = new vue({
            el: "body",
            created: function () {
                // 显示Body（全局CSS中对body初始样式设置为不显示，在这里显示，解决组件未生效时显示布局很乱的问题）
                showHide();
                console.log("使用默认视图模型");
            }
        });
    }

    // 自动检测页面模型JS
    var models = $("[data-model]");
    models.each(function () {
        var $model = $(this);
        var initModelName = $model.attr("data-model");
        if (initModelName) {
            require([initModelName], function (model) { });
        }
    });

});

// 检测页面是否有初始化函数
if (typeof (init) == "function") {
    init();
}
