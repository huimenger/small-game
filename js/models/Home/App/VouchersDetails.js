define([
    'jquery',
    'vue',
    'text!models/Home/App/Tpl/VouchersDetails.html',
    'models/Home/App/ActionBar',
     'eui/Toast',
     'commons/Http',
     'commons/Browser',
     'commons/Send',
     'commons/Query'
], function ($, Vue, Tpl, ActionBar, Toast, http, browser, send, query) {

    // 获取代金券详情
    var details = function (vm, callback) {
        if (!send.get.user()) return;
        http.get('https://api.ireadercity.com:4430/u/main/GetCouponItem', {
            userId: send.get.user().userID,
            date: vm.$route.query.date
        }, function (info) {
            if (info.status == 200) {
                callback && callback(info);
                return;
            }
            Toast.showError(info.msg);
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
                list:[]
            }
        },
        ready: function () {
            var self = this;
            details(this,function (info) {
                self.list = info.data;
                self.pageEnd = true;
            });
        }
    });
});