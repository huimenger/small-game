define(["jquery", "vue", "text!components/template/ReadHeader.html", "commons/Browser", "eui/Dialog"], function ($, vue, tpl, browser, dialog) {
    var component = vue.extend({
        props: {
            existshelf: {
                default: false
            }
        },
        data: function () {
            return {
                isShowHeader: false,
                isShowBack: !browser.isWannianli
            };
        },
        template: tpl,
        ready: function () {
            var self = this;
        },
        created: function () {
            $(".ic-header-addDesktop").hide();
            /*
            if (browser.isApple && browser.isMobile) {
                if (browser.isSafari || browser.isWeixin) {
                    $(".ic-header-addDesktop").show();
                }
            }*/
        },
        methods: {
            hideHeader: function () {
                this.isShowHeader = false;
            },
            showHeader: function () {
                this.isShowHeader = true;
            },
            back: function () {
                this.$dispatch("headerBack");
            },
            addShelf: function () {
                this.$dispatch("addShelf");
            },
            addDesktop: function () {
                $(".v-add-top-desktop").show();
            }
        }
    });
    vue.component("read-header", component);
    return component;
});