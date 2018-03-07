define([
    'vue',
    "jquery",
    "swiper",
    'text!models/Home/App/Tpl/Card1.html',
    'commons/StatisticsTool',
], function (Vue, $, Swiper, Tpl, stat) {
    return Vue.extend({
        template: Tpl,
        props: {
            title: "标题",
            more: {
                default: ""
            },
            color: {
                default: "red"
            },
            autoplay: {
                default: 0,
                type: Number
            },
            books: {
                default: []
            }
        },
        data: function () {
            return {
                current: 0
            };
        },
        computed: {
            imgBooks: function () {
                var self = this;
                var books = this.books.filter(function (book) {
                    return !!book.imgUrl;
                });
                Vue.nextTick(function () {
                    self.swiper.update();
                });
                return books;
            },
            textBooks: function () {
                return this.books.filter(function (book) {
                    return !book.imgUrl;
                });
            }
        },
        ready: function () {
            var self = this;
            var continer = $(this.$el).find(".swiper-container");
            this.swiper = new Swiper(continer, {
                autoplay: this.autoplay,
                autoplayDisableOnInteraction: false,
                onSlideChangeEnd: function (swiper) {
                    self.current = swiper.activeIndex;
                }
            });
        },
        methods: {
            read: function (book) {
                stat.track("WAP精选", (stat.getAppId() || "web"), "点击标题_" + book.title);
                location.href = book.linkUrl;
            },
            showMore: function () {
                stat.track("WAP精选", (stat.getAppId() || "web"), "点击更多");
            }
        }
    });
});