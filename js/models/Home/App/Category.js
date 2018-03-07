define(['vue', "jquery", 'eui/Toast', 'text!models/Home/App/Tpl/Category.html', 'text!models/Home/App/Tpl/CategoryBox.html'], function (Vue, $, Toast, Tpl, CategoryBoxTpl) {
    var CategoryBox = Vue.extend({
        props: {
            title: "",
            list: []
        },
        template: CategoryBoxTpl
    });

    // 数据缓存
    var cache = {
        loaded: false,
        boyCategories: [],
        girlCategories: [],
        publishCategories: []
    };

    return Vue.extend({
        data: function () {
            return cache;
        },
        template: Tpl,
        components: {
            "category-box": CategoryBox
        },
        created: function () {
            if (!this.loaded) {
                this.load();
            }
        },
        methods: {
            load: function () {
                var self = this;
                Toast.showProgress('加载中');
                $.get("/WebApi/Category/FindCategories", {}, function (json) {
                    Toast.hide();
                    if (json.isSuccess) {
                        self.boyCategories = json.data.boyCategories;
                        self.girlCategories = json.data.girlCategories;
                        self.publishCategories = json.data.publishCategories;
                        self.loaded = true;
                    } else {
                        Toast.showError(json.message);
                    }
                }, "json");
            }
        }
    });
});