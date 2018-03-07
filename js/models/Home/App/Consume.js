define([
    'jquery',
    'vue',
    'text!models/Home/App/Tpl/Consume.html',
    'models/Home/App/ActionBar',
     'eui/Toast',
     'commons/Http',
     'commons/Browser',
     'commons/Send'
], function ($, Vue, Tpl, ActionBar, Toast, http, browser, send) {

    function n(n) {
        return n < 10 ? '0' + n : '' + n;
    }
    Vue.filter('filter-date', function (value) {
        value = value.replace(/-/g, "/");
        var current = new Date();
        var billTime = new Date(value);
        var year = '';
        if (billTime.getFullYear() !== current.getFullYear()) {
            year = billTime.getFullYear();
        }
        year = year ? year + '-' : '';

        return year + n(billTime.getMonth() + 1) + '-' + n(billTime.getDate()) + ' ' + n(billTime.getHours()) + ':' + n(billTime.getMinutes());
    });

    return Vue.extend({
        template: Tpl,
        components: {
            "app-action": ActionBar
        },
        data: function () {
            return {
                pageEnd: false,
                current: 1,
                size: 10,
                arg: {
                    userId: send.get.user().userID,
                    deviceType: browser.platform
                },
                /* 充值数据 */
                dataPay: {
                    Loading: false,
                    firstLoadEnd: false,
                    isEnd: false,
                    current: 1,
                    item: []
                },
                /* 支付数据 */
                dataRecharge: {
                    Loading: false,
                    firstLoadEnd: false,
                    isEnd: false,
                    current: 1,
                    item: []
                }
            }
        },
        ready: function () {
            $('#p_consume').css('min-height', document.documentElement.offsetHeight - 45);
        },
        created: function () {
            if (!send.get.user()) {
                window.location.href = '/WebApp/Account/Login.html?redirect=' + encodeURIComponent(window.location.href);
                return;
            }
            if (this.$route.params.current == 1 || this.$route.params.current == 2) {
                this.current = parseInt(this.$route.params.current);
            }
            this.pageEnd = true;
            this.ajax();
            this.scroll();
        },
        methods: {
            /* 滚到至页面底部 */
            scroll: function () {
                var self = this;
                window.onscroll = function () {
                    if (self.$route.path.indexOf('/Consume') == -1) return;

                    var height = document.body.scrollHeight - document.documentElement.clientHeight;
                    var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                    if (scrollTop >= height) {
                        self.ajax();
                    }
                }
            },
            /* 切换事件 */
            tab: function (index) {
                this.current = index;
                // 如果是第一次加载
                if (this.current === 1 && this.dataPay.firstLoadEnd) return;
                if (this.current === 2 && this.dataRecharge.firstLoadEnd) return;
                this.ajax();
            },
            /* 发送请求 */
            ajax: function () {
                if (this.current === 1) {
                    this.pay();
                }
                if (this.current === 2) {
                    this.recharge();
                }
            },
            pay: function () {
                var self = this;
                if (self.dataPay.loading) return;
                self.dataPay.loading = true;
                Toast.showProgress('加载中');
                http.get('https://api.ireadercity.com:4430/u/main/GetConsumptionRecords', {
                    Id: self.arg.userId,
                    PageIndex: self.dataPay.current,
                    PageSize: self.size
                }, function (data) {
                    Toast.hide();
                    if (data.status == 200) {
                        self.dataPay.firstLoadEnd = true;
                        self.dataPay.isEnd = data.data.isEnd;
                        self.dataPay.item = self.dataPay.item.concat(data.data.records);
                        self.dataPay.current++;
                    } else {
                        Toast.showError(data.msg);
                    }
                    self.dataPay.loading = false;
                });
            },
            recharge: function () {
                var self = this;
                if (self.dataRecharge.loading) return;
                self.dataRecharge.loading = true;
                Toast.showProgress('加载中');
                http.get('https://api.ireadercity.com:4430/u/main/GetTransDetail', {
                    Id: self.arg.userId,
                    PageIndex: self.dataRecharge.current,
                    PageSize: self.size
                }, function (data) {
                    Toast.hide();
                    if (data.status == 200) {
                        self.dataRecharge.firstLoadEnd = true;
                        self.dataRecharge.isEnd = data.data.isEnd;
                        self.dataRecharge.item = self.dataRecharge.item.concat(data.data.trans);
                        self.dataRecharge.current++;
                    } else {
                        Toast.showError(data.msg);
                    }
                    self.dataRecharge.loading = false;
                });
            }
        }
    });
});