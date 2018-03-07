define([
    'jquery',
    'vue',
    'text!models/Home/App/Tpl/Pay.html',
     'commons/Http',
     'commons/Browser',
     'commons/Send',
     'commons/StatisticsTool',
     'eui/Toast'
], function ($, Vue, Tpl,http, browser, send,tool,toast) {
    
    //调用微信JS api 支付
    function jsApiCall(data) {
        WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                {
                    "appId": data.appId,
                    "timeStamp": data.timeStamp,
                    "nonceStr": data.nonceStr,
                    "package": data.package,
                    "signType": data.signType,
                    "paySign":data.paySign
                }, //josn串
                function (res) {
                    if (res.err_msg == 'get_brand_wcpay_request:ok') {
                        window.location.href = "/WebApp/Order/OrderReturn.html";
                    } else {
                        
                    }
                }
            );
    }

    function onBridgeReady() {
        WeixinJSBridge.call('hideOptionMenu');
    }

    return Vue.extend({
        template: Tpl,
        components: {},
        data: function () {
            return {}
        },
        created: function () {
            this.callpay();
        },
        methods: {
            callpay: function () {

                if (!send.get.user()) {
                    // 回到首页
                    window.location.href = '/webapp/account/login.html?redirect=' + encodeURIComponent(window.location.href);
                    return;
                }

                var self = this;
                $.post('https://api.ireadercity.com:4430/p/api/Order/CreatePublicOrder', {
                    CSI: {
                        Channel: tool.getAppId(),
                        UserId: send.get.user().userID,
                        Platform: browser.platform
                    },
                    CBD: {
                        Code: this.$route.query.Code,
                        ConfigId: this.$route.query.ConfigId
                    }
                }, function (info) {
                    if (info.status === 200) {
                        if (typeof WeixinJSBridge == "undefined") {
                            if (document.addEventListener) {
                                document.addEventListener('WeixinJSBridgeReady', function () {
                                    jsApiCall(info.data);
                                }, false);
                                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                            }
                            else if (document.attachEvent) {
                                document.attachEvent('WeixinJSBridgeReady', function () {
                                    jsApiCall(info.data);
                                });
                                document.attachEvent('onWeixinJSBridgeReady', function () {
                                    jsApiCall(info.data);
                                });
                                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                            }
                        }
                        else {
                            onBridgeReady();
                            jsApiCall(info.data);
                        }

                    } else {
                        toast.showError(info.msg);
                    }
                });
            }
        }
    });
});