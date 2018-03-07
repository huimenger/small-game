/* 定义搜索功能实现 */
define(['vue', 'eui/Toast', 'jquery', 'store'], function (vue, toast, $, store) {
    var search = vue.extend({
        data: function () {
            return {
                model: "",
                searchValue: "",
                placeholder: "请输入书名或作者名",
                initPlaceholder : "请输入书名或作者名",
                allTag : []
            }
        },
        props: {
            type: {
                default: '01'
            },
            value: {
                default: ''
            }
        },
        ready: function () {
            this.model = this.value;
            // 获取标签
            this.getHotBook(function () {
                // 默认搜索
                this.selected();
            });
        },
        template: (function () {
            return '<form v-on:submit="search()" onsubmit="return false"><div class="search auto-x">'
                + '<input type="text" class="flex-1" v-bind:placeholder="placeholder" v-model="model" v-on:input="input" v-on:blur="blur()" v-on:focus="focus()"/>'
                // + '<p class="linear"></p>'
                + '<a href="javascript:;" class="btn" v-on:click="search()"><i class="ic-v3-search"></i></a>'
                + '</div></form>';
        })(),
        methods: {
            getHotBook: function (callback) {
                var self = this;
                // 缓存内是否存在
                if (store.get('HotTagMessage')) {
                    self.allTag = store.get('HotTagMessage');
                    callback && callback.call(self);
                } else { 
                    $.get('/WebApi/HotKey/FindKeyList', {}, function (data) {
                        if (data.isSuccess) {
                            store.set('HotTagMessage', data.data);
                            self.allTag = store.get('HotTagMessage');
                            callback && callback.call(self);
                        } else {
                            toast.showError(data.message);
                        }
                    });
                }
            },
            validate: function () {
                if (this.model == '') {
                    return '搜索内容不能为空';
                }
                return false;
            },
            focus: function () {
                // 获取标签
                if (this.model == this.placeholder) {
                    this.model = '';
                }
                this.placeholder = '';
            },
            selected: function () {
                if (this.allTag.length) {
                    this.placeholder = this.allTag[Math.floor(Math.random() * this.allTag.length)];
                }
            },
            blur: function () {
                if (this.model == '') {
                    this.selected();
                }
            },
            search: function () {
                if (this.model == '' && this.placeholder == '') {
                    setTimeout(function() {
                        toast.showError('请输入搜索内容');
                    },300);
                } else {
                    window.location.href = '/WebApp/book/search.html?key=' + (this.model || this.placeholder);
                }

                /*
                if (this.initPlaceholder != this.placeholder) {
                    if (this.model == '') {
                        this.model = this.placeholder;
                        this.placeholder = this.initPlaceholder;
                    }
                    // 搜索
                    if (this.type == '01'){
                        window.location.href = '/WebApp/book/search.html?key=' + (this.model || this.placeholder);
                    }
                }*/
                return false;
            },
            input: function () {
                this.$parent.$broadcast('search-change', this.model);
            }
        },
        events: {
            "search-change": function (val) {
                this.model = val;
                return true;
            }
        }
    });

    vue.component('view-search', search);

});