define(["jquery", "vue", "commons/Browser", "commons/Query"], function ($, vue, browser, query) {
    var vm = new vue({
        el: 'body',
        data: {
            cards: [],
            page: 1,
            pagesize: 20,
            loaded: false,
            isAndroid: browser.isAndroid,
            isApple: browser.isApple,
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
                $.get("/webapp/Api/Wnl.html?channleId=" + (!!query.get("channelId") ? query.get("channelId") : "WnlBanner"),
                {
                    page: self.page,
                    pagesize: self.pagesize
                },
                function (data) {
                    self.page++;
                    self.isLoading = false;
                    if (data.length <= 0) {
                        $(".finish").removeClass("ehide");
                        return;
                    }
                    self.cards = self.cards.concat(data);
                }, "json");
            },
            loadImg: function (event) {
                var target = $(event.target);
                target.removeClass("ehide");
            },
            dealHref: function (link) {
                if (query.get("client")) {
                    var linkQuery = query.build(link);
                    link = 'protocol://openbook?jsondata={"bookid":"' + linkQuery.get("bookId") + '"}';
                } else {
                    link = link.substring(24);
                }
                return link;
            }
        }
    });
});