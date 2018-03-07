/*==================================================
 Author lingli
 EUI框架-对话框模块
 ==================================================
 用例：
 1、自定义对话框
        dialog.show({    
            title: "lingli",
            html: '<input type="text" />',
            btns: [
            {
                text: "cancel",
                style: 1
            },
            {
                text: "sure",
                style: 2,
                callback: function (dialog) {
                    alert(99);
                }
            }
            ]
        });
 2、确认对话框confirm（两个按钮）
        dialog.showConfirm({
            text: "是否删除",
            ok: function(dialog) {
                    dialog.remove();
                }
        });
 3、确定弹出框（一个按钮）
        dialog.showAlert({
            text: "您已报名成功",
            ok: function(dialog) {
                dialog.remove();
            }
        });
================================================== */

define(["jquery"], function ($) {
    //各种框的集合  可以自定义多个按钮 自定义标题  自定义内容（文本、输入框等等）
    var dialog = {
        show: function (options) {
            options = $.extend({}, {
                title: "标题",
                html: "",   //自定义内容
                btns: [],   //自定义多个按钮
                closeable: true  //是否有关闭图标
            }, options);

            var mask = $('<div class="lui-dialog"><div class="mask"></div></div>');
            var box = $('<div class="box"></div>');
            var header = $('<div class="header" style="padding:0;">' + options.title + (options.closeable ? '<i class="eui-delete"></i>' : "") + '</div>');
            var body = $('<div class="body">' + options.html + '</div>');
            var footer = $('<div class="footer" style="background:none;"></div>');

            mask.append(box);
            box.append(header);
            box.append(body);
            box.append(footer);

            mask.on("touchend", function (event) {
                event.stopPropagation();
            });

            //循环动态添加多个按钮
            for (var i = 0; i < options.btns.length; i++) {
                var btnOptions = options.btns[i];
                btnOptions = $.extend({}, {
                    text: "取消",
                    style: 1,
                    callback: function (dialog) {
                        dialog.remove();
                    }
                }, btnOptions);
                var btn = $('<div class="btn' + btnOptions.style + '">' + btnOptions.text + '</div>');
                btn[0].callback = btnOptions.callback;
                btn[0].onclick = function () {
                    this.callback(mask);
                }
                footer.append(btn);
            }

            $("body").append(mask);

            var width = box.width();
            var height = box.height();

            box.css("margin-left", -width / 2);
            box.css("margin-top", -height / 2);

            //点击x图标,框消失
            $(".eui-delete").click(function () {
                mask.remove();
            });

            return mask;
        },

        //确认框
        showConfirm: function (options) {
            options = $.extend({}, {
                title: "询问",
                text: "是否XXX",
                closeable: true,
                ok: function (dialog) {
                    dialog.remove();
                },
                cancel: function (dialog) {
                    dialog.remove();
                }
            }, options);
            dialog.show({
                title: options.title,
                html: options.text,
                closeable: options.closeable,
                btns: [
                    {
                        text: "确定",
                        callback: options.ok,
                        style: 1
                    },
                    {
                        text: "取消",
                        style: 2,
                        callback: options.cancel
                    }
                ]
            });
        },

        //提示框
        showAlert: function (options) {
            if (typeof options == 'string') {
                options = { text: options };
            }
            options = $.extend({}, {
                title: "提示",
                text: "添加成功",
                closeable: true,
                ok: function (dialog) {
                    dialog.remove();
                }
            }, options);
            dialog.show({
                title: options.title,
                html: options.text,
                closeable: options.closeable,
                btns: [
                    {
                        text: "确定",
                        callback: options.ok,
                        style: 1
                    }
                ]
            });
        }
    };
    return dialog;
});