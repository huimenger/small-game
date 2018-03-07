define(["vue", "commons/InitData", "eui/Toast", "commons/Download", "commons/Send"], function (vue, initData, toast, download,send) {
    initData = JSON.parse(initData);
    var vm = new vue({
        el: "body",
        data: {
            pageEnd:false,
            // 是否没有签到
            HasSign: (initData.HasSign.toLowerCase() == 'false'),
            CurrentUserCoin: 0, //parseInt(initData.CurrentUserCoin),
            CurrentUserCoupon:0,
            showAlert: false,
            browser: (function () {
                var u = navigator.userAgent;
                var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
                var isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                if (isAndroid) {
                    return "Android";
                } else if (isIos) {
                    return "iPhone";
                } else {
                    return "";
                }
            })()
        },
        ready: function () {
            var self = this;
            send.residual(function (info) {
                self.pageEnd = true;
                self.CurrentUserCoin = info.data.coin;
                self.CurrentUserCoupon = info.data.coupon;
            });
        },
        methods: {
            openApp: function () {
                download.download();
            },
            hide: function () {
                this.showAlert = false;
            },
            show: function () {
                this.showAlert = true;
            },
            sign: function () {
                if (!this.sign) return;
                var self = this;
                $.post("/WebApi/User/Sign", {
                    Platform: this.browser,
                    AppId: "wap"
                }, function (data) {
                    if (data.isSuccess) {
                        self.HasSign = false;
                        self.CurrentUserCoin = data.data.coin;
                        self.show();
                    } else {
                        toast.showError(data.message);
                    }
                });
            }
        }
    });

});