({
    baseUrl: ".",
    paths: {
        jquery: '../../libs/jquery-1.11.3.min',
        vue: '../../libs/vue.min',
        InitData: "../../commons/InitData",
        "commons/Query": "../../commons/Query",
        StatisticsTool: "../../commons/StatisticsTool",
        "commons/Browser": "../../commons/Browser"
    },
    // 将要合并的模块写在下面，最终这些代码将会被合并到一个JS文件
    deps: [
        "vue",
        "jquery",
        "InitData",
        "commons/Browser",
        "commons/Query",
        "StatisticsTool"
    ],
    shim: {
        "jquery": {
            exports: "jQuery"
        },
        vue: {
            exports: "Vue"
        }
    },
    name: "main",
    out: "main-built.js",
    preserveLicenseComments: false
    //, optimize: "none"
})