define(["jquery", "commons/Query", "vue", "eui/Toast"], function ($, query, vue, toast) {
    var vm = new vue({
        el: "body",
        data: {
            categoryId: query.get("categoryId") || "0",
            type: query.get("type") || 1,
            rank: [],
            rankName: ["", "畅销榜", "人气榜", "", "阅读榜"],
            subName: ["男生", "女生", "出版"]
        },
        created: function () {
            this.load();
        },
        methods: {
            load: function () {
                var self = this;
                history.replaceState(null, document.title, "/webapp/rank/index.html?categoryId=" + this.categoryId + "&type=" + this.type);
                toast.showProgress("加载中");
                $.get("/webapp/rank/MoreSub.html", { categoryId: this.categoryId, type: this.type, size: 10 }, function (json) {
                    toast.hide();
                    if (json.status) {
                        self.rank = json.data;
                    }
                }, "json");
            },
            changeType: function (type) {
                if (this.type === type) {
                    return;
                }
                this.type = type;
                this.load();
            },
            changeCategory: function (categoryId) {
                if (this.categoryId === categoryId) {
                    return;
                }
                this.categoryId = categoryId;
                this.load();
            },
            showMore: function () {
                location.href = "/webapp/rank/sub.html?categoryid=" + this.categoryId + "&type=" + this.type;
            }
        }
    });
    return vm;
});