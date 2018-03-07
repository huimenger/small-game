define(["jquery", "vue", "commons/InitData", "commons/StatisticsTool", "eui/Dialog","commons/Browser"], function ($, vue, initData, tool, dialog,browser) {
    var vm = new vue({
        el: "body",
        data: {
            list: JSON.parse(initData),
            isSelectMoney: 0,

            money: 0,
            channelId: tool.getAppId(),
            childChannelId: tool.getSubAppId() 
        },
        ready: function () {
            var self = this;
            self.money = self.list[0].Money;
        },
        methods: {
            selectMoney: function (index, item) {
                vm.isSelectMoney = index;
                vm.money = item.Money;
            },
            openWindow: function () {
                if (browser.isWeixin) {
                    $("#payMethod").val("wechat");
                    $('#form').submit();
                } else {
                    // 以下两句代码，是因为微信WAP支付不能用，所以直接使用支付宝。等待微信wap支付能用在删除。并解除下面一段注释
                    $("#payMethod").val("alipay");
                    $('#form').submit();
                    /*
                    dialog.show({
                        title: "充值方式",
                        html: '',
                        closeable: true,  //是否有关闭图标
                        btns: [
                            {
                                text: "微信",
                                style: 1,
                                callback: function () {
                                    $("#payMethod").val("wechat");
                                    $('#form').submit();
                                }
                            },
                            {
                                text: "支付宝",
                                style: 1,
                                callback: function () {
                                    $("#payMethod").val("alipay");
                                    $('#form').submit();
                                }
                            }
                        ]
                    });
                    */
                }
            }
         }
     });
    return vm;
});
