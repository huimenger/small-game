define([
    'vue',
    "jquery",
    'text!models/Home/App/Tpl/Card3.html'
], function (Vue, $, Tpl) {
    return Vue.extend({
        $swiper: false,
        template: Tpl,
        props: ["title", "more", "books","color"],
        data: function () {
            return {

            };
        },
        ready: function () {

        },
        methods: {

        }
    });
});