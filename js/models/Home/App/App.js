define(['vue', 'libs/fastclick', 'text!models/Home/App/Tpl/App.html', 'models/Home/App/Header', 'models/Home/App/NavBar', 'models/Home/App/Footer'], function (Vue, fastclick, Tpl, Header, NavBar, Footer) {
    return Vue.extend({
        template: Tpl,
        components: {
            "app-header": Header,
            "nav-bar": NavBar,
            "app-footer": Footer
        },
        ready: function () {
            fastclick.attach(document.getElementById('App'));
        }
    });
});