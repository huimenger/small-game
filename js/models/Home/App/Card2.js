define([
    'vue',
    "jquery",
    "swiper",
    'text!models/Home/App/Tpl/Card2.html'
], function (Vue, $, Swiper, Tpl) {
    return Vue.extend({
        $swiper: false,
        template: Tpl,
        props: {
            title: {
                default: "",
            },
            more: {
                default: ""
            },
            books: {
                default: []
            },
            color: {
                default: ""
            },
            showRank: {
                default: true
            }
        },
        data: function () {
            return {

            };
        },
        computed: {
            "list": function () {
                var self = this;
                Vue.nextTick(function () {
                    self.$swiper.update();
                });
                return this.books;
            }
        },
        ready: function () {
            var continer = $(this.$el).find(".swiper-container");
            this.$swiper = new Swiper(continer, {
                slidesPerView: "auto"
            });
        },
        methods: {

        }
    });
});