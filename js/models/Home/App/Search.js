define([
    'vue',
    "jquery",
    "swiper",
    'text!models/Home/App/Tpl/Search.html'
], function (Vue, $, Swiper, Tpl) {
    return Vue.extend({
        $swiper: false,
        template: Tpl,
        props: ["title", "more", "books"],
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