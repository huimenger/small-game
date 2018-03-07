/*==================================================
 Author lingli
 EUI框架-提示框模块
 ==================================================
 用例：
        toast.show({
            place: "top",
            msg: "删除成功",
            icon: "success",
            time: "500"
        });
================================================== */

define(["jquery"], function ($) {
    var toast = {
        show: function (options) {
            $(".lui-toast").remove();
            options = $.extend({}, {
                place: "center",  //提示框的位置。总共7个值：center(默认值) top topLeft topRight bottom bottomLeft bottomRight
                icon: "",     //提示框的图标。总共4个值：success infor error warn progress
                msg: "",    //提示框的文本。
                time: ""   //提示框自动消失的时间
            }, options);

            var box = $('<div class="lui-toast ' + options.place + '"><i class="eui-' + options.icon + '"></i><div class="word">' + options.msg + '</div></div>');
            $("body").append(box);

            if (options.time) {
                setTimeout(function () {
                    box.hide();
                }, options.time);
            }
        },
        showProgress: function (msg) {
            toast.show({
                msg: msg,
                icon: "progress"
            });
        },
        showError: function (msg) {
            toast.show({
                msg: msg,
                time: 3000,
                icon: "error"
            });
        },
        showSuccess: function (msg) {
            toast.show({
                msg: msg,
                time: 3000,
                icon: "success"
            });
        },
        showInfo: function (msg) {
            toast.show({
                msg: msg,
                time: 3000,
                icon: "infor"
            });
        },
        showWarn: function (msg) {
            toast.show({
                msg: msg,
                time: 3000,
                icon: "warn"
            });
        },
        hide: function () {
            $(".lui-toast").remove();
        }
    };
    return toast;
});