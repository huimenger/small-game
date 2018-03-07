define(['vue', 'text!models/Home/App/Tpl/NavBar.html', "commons/InitData"], function (Vue, Tpl, InitData) {
    InitData = JSON.parse(InitData);
    return Vue.extend({
        template: Tpl,
        data: function () {
            return InitData
        },
        created: function () {
            console.log(this.$route);
        }
    });
});