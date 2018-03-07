define(['vue', 'jquery', 'eui/Toast', 'text!models/Home/App/Tpl/Index.html'], function (Vue, $, Toast, Tpl) {
    // 已经请求过的数据临时缓存
    var item = {};

    return Vue.extend({
        template: Tpl,
        data: function () {
            return {
                item: []
            }
        },
        ready: function () {
            // 加载数据
            if (item.data) {
                this.item = item.data;
            } else {
                this.load();
            }
        },
        methods: {
            location: function (id) {
                window.location.href = '/Book/Detail.html?bookId=' + id;
            },
            load: function () {
                var self = this;
                Toast.showProgress('加载中');
                $.get('/WebApi/Book/FindGirlBooks', function (data) {
                    Toast.hide();
                    if (data.isSuccess) {
                        item = data;
                        self.item = data.data;
                    } else {
                        Toast.showError(data.message);
                    }
                });
            }
        }
    });
});