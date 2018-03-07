define([
    'vue',
    'jquery',
    'text!models/Home/App/Tpl/Recharge.html',
    "commons/StatisticsTool",
    "eui/Dialog",
    "eui/Toast",
    "commons/Browser",
    "commons/Http",
    "commons/Send"
], function (Vue, $, Tpl, tool, dialog, toast, browser, http, send) {

    var dpi = function (doc, win) {
        var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                docEl.style.fontSize = 20 * (clientWidth / 375) + 'px';
            };
        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvt, recalc, false);
        recalc();
    }

    var wchatOrder = function (id) {
        if (!send.get.user()) {
            window.location.href = '/WebApp/Account/Login.html?redirect=/webapp/home/index.html#/Recharge';
        }
        if (!id) {
            toast.showError('非法操作');
            return;
        }
        var url = encodeURIComponent('http://m.ireadercity.com/webapp/page/Pay.html?userId=' + send.get.user().userID + '&configId=' + id + '&channel=' + tool.getAppId());
        toast.showProgress('加载中');
        // 授权地址
        $.get('https://api.ireadercity.com:4430/p/api/Wechat/GetRedirect?redirectUrl=' + url, function (info) {
            toast.hide();
            if (info.status == 200) {
                window.location.href = info.data.redirectUrl;
            } else {
                toast.showError(info.msg);
            }
        });
    }
    var createOrder = function (data) {
        // 用户未登录
        if (!send.get.user()) {
            window.location.href = '/WebApp/Account/Login.html?redirect=/webapp/home/index.html#/Recharge';
        }
        if (!data.ConfigId || !data.PayMethod) {
            toast.showError('非法操作');
            return;
        }
        toast.showProgress('加载中');

        http.md5.post('https://api.ireadercity.com:4430/p/api/Order/CreateWapOrder', {
            CSI: {
                Channel: tool.getAppId(),
                UserId: send.get.user().userID,
                Platform: browser.platform
            },
            CBD: data
        }, function (info) {
            toast.hide();
            if (info.status != 200) {
                toast.showError(info.msg);
                return;
            }
            document.write(info.data.html);
        });
    }

    return Vue.extend({
        data: function () {
            return {
                list: [],
                pageEnd: false
            }
        },
        template: Tpl,
        ready: function () {
            var self = this;
            dpi(document, window);
            this.get(function () {
                self.pageEnd = true;
            });
            try {
                window._czc.push(["_trackEvent", "H5", "充值", "首页"]);
            } catch (error) { }
        },
        methods: {
            get: function (callback) {
                if (!send.get.user()) {
                    window.location.href = '/WebApp/Account/Login.html?redirect=' + encodeURIComponent(window.location.href);
                    return;
                }
                toast.showProgress('加载中');
                var self = this;
                http.get('https://api.ireadercity.com:4430/u/main/GetWapRechargeConfig', {
                    UserId: send.get.user().userID
                }, function (info) {
                    toast.hide();
                    if (info.status == 200) {
                        self.list = info.data.configs;
                    } else {
                        toast.showError(info.msg);
                    }
                    callback && callback(info);
                });
            },
            open: function (el) {
                if (browser.isWeixin) {
                    // 微信内充值
                    wchatOrder(el.id);
                } else {
                    dialog.show({
                        title: "充值 " + el.coin + "金币",
                        html: '',
                        closeable: true,  //是否有关闭图标
                        btns: [
                            {
                                text: "微信",
                                style: 1,
                                callback: function () {
                                    createOrder({
                                        ConfigId: el.id,
                                        PayMethod: 'WxPay'
                                    });
                                }
                            },
                            {
                                text: "支付宝",
                                style: 1,
                                callback: function () {
                                    createOrder({
                                        ConfigId: el.id,
                                        PayMethod: 'AliPay'
                                    });
                                }
                            }
                        ]
                    });
                }
            }
        }
    });
});