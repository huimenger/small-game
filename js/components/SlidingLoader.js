//define(["jquery", "vue", "commons/InitData"], function ($, vue, initData) {
//    var component = vue.extend({
//        props: {
//            loadUrl: {
//                default: "ListMore.html"
//            },
//            data: {
//                default: []
//            }
//        },
//        template: '<ul><slot></slot></ul>',
//        ready: function () {
//            console.log(this.data);
//            this.data = this.data.concat(JSON.parse(initData));
//            console.log(this.data);
//        }
//    });
//
//    vue.component("sliding-loader", component);
//    return component;
//});

define(["jquery", "vue", "commons/InitData"], function ($, vue, initData) {
    var component = vue.extend({
        props: {
            loadUrl: {
                default: "ListMore.html"
            },
            data: {
                default: []
            }
        },
        template: '<ul><slot></slot></ul>',
        ready: function () {
            console.log(this.data);
            this.data = this.data.concat(JSON.parse(initData));
            console.log(this.data);
        }
    });

    vue.component("sliding-loader", component);
    return component;
});
