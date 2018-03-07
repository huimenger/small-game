define([
    'vue',
    'jquery',
    'eui/Toast',
    'text!models/Home/App/Tpl/Index.html',
    "models/Home/App/Card1",
    "models/Home/App/Card2",
    "models/Home/App/Card3"
], function (Vue, $, Toast, Tpl, Card1, Card2, Card3) {
    // 已经请求过的数据临时缓存
    var cache = {
        item: [],
        booksJinxuan: [],
        loadingCount: 0,
        loaded: false
    };

    return Vue.extend({
        template: Tpl,
        components: {
            'view-card1': Card1,
            'view-card2': Card2,
            'view-card3': Card3
        },
        data: function () {
            return cache;
        },
        ready: function () {
            if (!this.loaded) {
                this.load();
            }
            this.loaded = true;
        },
        methods: {
            location: function (id) {
                window.location.href = '/Book/Detail.html?bookId=' + id;
            },
            load: function () {
                var self = this;
                Toast.showProgress('加载中');
                this.loadingCount = 2;
                $.get('/WebApi/Channel/FindTopByChannelId?channelId=WapIndex', function (data) {
                    self.isLoaded();
                    if (data.isSuccess) {
                        self.booksJinxuan = data.data;
                    } else {
                        Toast.showError(data.message);
                    }
                });
                $.get('/WebApi/Book/FindHomeBooks', function (data) {
                    self.isLoaded();
                    if (data.isSuccess) {
                        self.item = data.data;
                    } else {
                        Toast.showError(data.message);
                    }
                });
            },
            isLoaded: function () {
                this.loadingCount--;
                if (this.loadingCount <= 0) {
                    Toast.hide();
                }
            }
        }
    });
});