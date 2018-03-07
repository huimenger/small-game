define(["jquery", "vue","eui/Toast","commons/Query"], function ($, vue,toast,query) {
    var vm = new vue({
        el: 'body',
        data: {
            cards: [],
            count: 0,
            page: 1,
            pagesize: 20,
            loaded: false,
            isLoading: false
        },
        created: function () {
            var self = this;
            self.load();

            //上拉加载
            $(window).scroll(function (event) {
                if ($(document).scrollTop() <= 0) {
                    // 到顶
                } else if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                    // 到底
                    self.load();
                }
            });
        },
        ready: function () {

        },
        methods: {
            load: function () {
                var self = this;
                if (self.isLoading) {
                    return;
                }
                self.isLoading = true;
                toast.showProgress("正在加载中");
                $.get("/webapp/Api/Wnl.html?channleId=" + (!!query.get("channelId") ? query.get("channelId") : "WnlBanner"),
                {
                    page: self.page,
                    pagesize: self.pagesize
                },
                function (data) {
                    toast.hide();
                    self.page++;
                    self.isLoading = false;
                    if (data.length <= 0) {
                        $(".finish").removeClass("hide");
                        return;
                    }
                    console.log(data);
                    for ( var i = 0; i < data.length; i++ ) {
                        
                    }
                    self.cards = self.cards.concat(data);
                    self.count = self.cards.length;
                }, "json");
            },
            loadImg: function (event) {
                var target = $(event.target);
                target.removeClass("hide");
            }
        }
    });
    return vm;
});