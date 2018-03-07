var devaEye = {
    start: function () {
        devaEye.init();
    },
    init: function () {
        var sc = document.createElement("script");
        sc.id = "_wilddog";
        sc.src = "https://cdn.wilddog.com/js/client/current/wilddog.js";
        sc.onload = function () {
            console.info("天眼正在监控错误...");
            devaEye.load();
        }
        document.getElementsByTagName("head")[0].appendChild(sc);
    },
    load: function () {
        var ref = new Wilddog("https://sxear.wilddogio.com/");
        window.onerror = function (errorMessage, script, lineNumber, columnNumber, errorObj) {
            ref.child("errors").push({
                url: location.href,
                ua: navigator.userAgent,
                time: new Date(),
                detail: {
                    message: errorMessage,
                    script: script,
                    line: lineNumber,
                    column: columnNumber,
                    stack: errorObj ? errorObj.stack : null
                }
            });
        };
    }
};

devaEye.start();

if (typeof exports !== "undefined") {
    if (typeof module !== "undefined" && module.exports) {
        exports = module.exports = devaEye;
    }
    exports.default = devaEye;
} else if (typeof define === "function" && define.amd) {
    define([], devaEye);
} else {
    window.devaEye = devaEye;
}