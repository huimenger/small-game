define(['vue', 'jquery', 'eui/Toast', 'text!models/Home/App/Tpl/Rank.html'], function (Vue, $, Toast, Tpl) {
    var item = {};

    return Vue.extend({
        template: Tpl,
        data: function () {
            return {
                item : []
            }
        },
        ready: function () {
            this.load();
        },
        methods: {
            location: function (id,type) {
                window.location.href = '/webapp/rank/sub.html?categoryid='+id+'&type='+type;
            },
            load: function () {
                var self = this;
                if (item.data) {
                    self.item = item.data;
                    return;
                }
                Toast.showProgress('加载中');
                $.get('/WebApi/Book/FindRankBooks', function (data) {
                    if (data.isSuccess) {
                        item.data = data.data;
                        self.item = data.data;
                    } else {
                        Toast.showError(data.message);
                    }
                    Toast.hide();
                });
            }
        }
    });
});