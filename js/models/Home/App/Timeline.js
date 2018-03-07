define([
    'vue',
    'text!models/Home/App/Tpl/Timeline.html',
     "eui/Toast",
     "commons/PageLoader",
     'models/Home/App/ActionBar',
     "models/Home/App/Card1"
], function (Vue, Tpl, Toast, PageLoader, ActionBar, Card1) {
    return Vue.extend({
        template: Tpl,
        data: function () {
            return {
                page: 0,
                cards: [],
                loading: false
            };
        },
        components: {
            "view-card1": Card1,
            "action-bar": ActionBar,
        },
        ready: function () {
            var self = this;
            if (this.cards.length < 3) {
                this.load(function () {
                    self.load(function () {
                        self.load();
                    });
                });
            }

            // 已第一次加载的书籍条目数作为分页大小
            $(window).scroll(function (event) {
                if (self.isLeave) return;
                if ($(document).scrollTop() <= 0) {
                    // 到顶
                } else if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                    // 到底
                    self.load();
                }
            });
        },
        destroyed: function () {
            //this.isLeave = true;
        },
        methods: {
            load: function (callback) {
                var self = this;
                if (self.loading) {
                    return;
                }
                self.loading = true;
                self.page = self.page + 1;
                $.get("/WebApi/Channel/FindListByChannelId", {
                    channelId: "WapIndex",
                    page: self.page,
                    pageSize: 6
                }, function (json) {
                    if (json.data.length) {
                        self.cards.push({
                            books: json.data
                        });
                    }
                    self.loading = false;
                    if (callback) callback();
                }, "json");
            }
        }
    });
});