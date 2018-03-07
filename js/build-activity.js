({
    baseUrl: ".",
    paths: {
        jquery: 'libs/jquery-1.11.3.min'
    },
    shim: {
        "jquery": {
            exports: "jQuery"
        }
    },
    name: "main-activity",
    out: "activity-built.js",
	preserveLicenseComments: false
    //,optimize: "none"
})