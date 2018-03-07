define(["jquery", "vue", "commons/InitData", "commons/PageLoader", "Eui/Toast"], function ($, vue, initData, loader, toast) {
    var vm = new vue({
        el: "body",
        data: {
            list: [],
            hasRecord: true,
            page: 1,
            pageSize: 10,
            isFinish: false,

            record: 0,
            url: "/WebApi/User/FindConsumeList"
        },
        ready: function () {
            var self = this;
            self.firstLoad();
            
            // 已第一次加载的书籍条目数作为分页大小
            $(window).scroll(function (event) {
                if ($(document).scrollTop() <= 0) {
                    // 到顶
                } else if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                    // 到底
                    self.load();
                }
            });
        },
        methods: {
            firstLoad: function () {
                var self = this;
                toast.showProgress("加载中");
                $.get(self.url,
                {
                    UserID: JSON.parse(initData),
                    page: 1,
                    pageSize: self.pageSize
                },
                function (json) {
                    toast.hide();
                    if (json.status == 1) {
                        if (json.data.length > 0) {
                            self.list = json.data;
                            
                        } else {
                            self.isFinish = true;
                        }
                        if (self.record == 0) {  //现在是消费记录里
                            if (self.list.length <= 0) { 
                                self.hasRecord = false;
                                return;
                            } 
                            self.hasRecord = true;
                        }
                        if (self.record == 1) {  //现在是充值记录里
                            if (self.list.length <= 0) {
                                self.hasRecord = false;
                                return;
                            }
                            self.hasRecord = true;
                        }

                    }

                }, "json");
            },
            load: function () {
                var self = this;
                if (!self.isFinish) {
                    loader.bottom.show();
                    self.page++;
                    $.get(self.url,
                    {
                        UserID: JSON.parse(initData),
                        page: self.page,
                        pageSize: self.pageSize
                    },
                    function (json) {
                        loader.bottom.hide();
                        if (json.status == 1) {
                            if (json.data.length > 0) {
                                self.list = self.list.concat(json.data);
                            } else {
                                self.isFinish = true;
                            }

                        }

                    }, "json");
                }

            },
            selectRecord: function (num) {
                var self = this;
                self.list = [];
                self.record = num;
                if (num === 1) {
                    self.url = "/WebApi/User/FindRechargeList";
                } else {
                    self.url = "/WebApi/User/FindConsumeList";
                }
                self.firstLoad();
            }
        }
    });
    return vm;
});
