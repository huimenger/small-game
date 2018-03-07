define(["jquery", "vue", "text!components/template/ViewTab.html"], function ($, vue, tpl) {
    var sub = vue.extend({
        props: {
            title: {
                default: ""
            }
        },
        template: '<div class="swiper-slide"><slot></slot></div>'
    });

    var component = vue.extend({
        props: {
            tabStyle: {
                default: 0
            },
            fixed: {
                default: false
            },
            tabHead: {
                default: ""
            }
        },
        data: function () {
            return {
                tabId: "v-view-tab-" + (new Date().getTime()),
                pageId: "v-view-tab-head-" + (new Date().getTime())
            };
        },
        swiper: null,
        template: tpl,
        ready: function () {
            var self = this;
            if (this.tabHead) {
                this.pageId = this.tabHead;
            }
            this.swiper = new Swiper('#' + this.tabId, {
                autoHeight: true,
                pagination: '#' + this.pageId,
                paginationClickable: true,
                paginationBulletRender: function (index, className) {
                    if (self.$children.length === 0) {
                        return "";
                    }
                    var title = self.$children[index].title;
                    switch (self.tabStyle) {
                        case 1:
                        default:
                            return '<li style="width:' + (100 / self.$children.length) + '%;" class="' + className + '"><span>' + (title ? title : "") + '</span></li>';
                    }
                },
                onSlideChangeEnd: function () {
                    //self.$emit("change-tab", self.swiper);
                }
            });
            if (this.fixed) {
                var pg = $("#" + this.pageId);
                var y = pg.offset().top;
                pg.css("top", y + "px");
                pg.css("position", "fixed");
                var el = $(this.$el);
                var pt = parseInt(el.css("paddingTop"));
                el.css("paddingTop", pt + pg.height() + "px");
            }
        },
        events: {

        }
    });
    vue.component("view-sub", sub);
    vue.component("view-tab", component);
    return component;
});