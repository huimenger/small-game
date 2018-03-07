define([
    'jquery',
    'vue',
    'text!models/Home/App/Tpl/Vouchers.html',
    'models/Home/App/ActionBar',
     'eui/Toast',
     'commons/Http',
     'commons/Browser',
     'commons/Send'
], function ($, Vue, Tpl, ActionBar, Toast, http, browser, send) {
    // 获取用户代金券列表
    send.list = function (callback, error) {
        if (send.validate(error)) return;
        http.get('https://api.ireadercity.com:4430/u/main/GetCouponList', {
            UserId:send.get.user().userID
        }, function (info) {
            if (info.status === 200) {
                callback && callback(info);
            } else {
                Toast.showError(info.msg);
            }
        });
    }


    return Vue.extend({
        template: Tpl,
        components: {
            "app-action": ActionBar
        },
        data: function () {
            return {
                pageEnd:false,
                number: 0,
                list: []
            }
        },
        created: function (){
            var self = this;

            send.list(function (info) {
                self.list = info.data;
                send.cache.residual(function (info) {
                    self.number = info.data.coupon;
                    self.pageEnd = true;
                });
            });
        },
        methods: {
        }
    });
});