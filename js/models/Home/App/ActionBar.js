define(['vue', 'text!models/Home/App/Tpl/ActionBar.html', "commons/Browser"], function (Vue, Tpl, browser) {
    return Vue.extend({
        template: Tpl,
        props: {
            title: {
                type:String,
                default: "书香云集"
            },
            showHome: {
                type: Boolean,
                default: true
            },
            fixed: {
                type: Boolean,
                default: false
            },
            showBack: {
                type: Boolean,
                default: true
            }
        }
    });
});