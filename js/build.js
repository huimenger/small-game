({
    baseUrl: ".",
    paths: {
        jquery: 'libs/jquery-1.11.3.min',
        //vue: 'libs/vue',
        //vue: 'libs/vue.min',
        vue: "libs/vue.1.0.10",
        text: "libs/text",
        swiper: "plugins/swiper/swiper-3.3.1.jquery.min",
        store: "plugins/store"
    },
    // 将要合并的模块写在下面，最终这些代码将会被合并到一个JS文件
    deps: [
        
        "text",
        "vue",
        "jquery",
        "swiper",
        "store",
        "eui/Dialog",
        "eui/Toast",
        
        "commons/InitData",
        "commons/Query",
        "commons/Browser",
        "commons/PageLoader",

        "models/Account/Login",
        "models/Category/List",
        "models/Series/List",

        "models/Home/EditorsPicks",
        "models/Home/Sub",
        "models/Home/List",
        "models/Home/Timeline",
        "models/Home/Index",

        "models/Rank/Index",
        "models/Rank/Sub",

        "models/User/Consume",
        "models/User/Index",
        "models/User/Recharge",

        "models/Book/BatchBuy",
        "models/Book/Directory",
        "models/Book/Comment",
        "models/Book/Detail",
        "models/Book/Directory",
        "models/Book/Search",
        "models/Book/Read",
        "models/Book/ReadHistoryStore",

        "models/Shared/Header",
        "models/Shared/ActionBar",
        "models/Shared/Footer",

        // 单页
        "models/Home/Index"
    ],
    shim: {
        "jquery": {
            exports: "jQuery"
        },
        vue: {
            exports: "Vue"
        },
        swiper: {
            deps: ["jquery"]
        }
    },
    name: "main",
    out: "main-built.js",
    preserveLicenseComments: false
    // ,optimize: "none"
})
