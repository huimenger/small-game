/**
 * 与客户端交互的SDK
 */
(function() {
    // 判断平台的工具方法
    var ua = navigator.userAgent;
    var clientTool = {
        // 是否是Android
        isAndroid: ua.toLowerCase().indexOf("android") > -1 || ua.toLowerCase().indexOf("linux") > -1,
        // 是否是iPad
        isIpad: ua.indexOf("iPad") > -1,
        // 是否是iPhone
        isIphone: ua.indexOf("iPhone") > -1,
        // 是否在苹果设备
        isApple: false
    };
    clientTool.isApple = (clientTool.isIphone === true || clientTool.isIpad === true);

    // 客户端回调
    window.host_sdk = {

        // 已经初始化过
        initialized: false,

        // 生命周期方法，初始化
        onInit: function() {
            window.host_sdk.initialized = true;
            if (hostsdk && hostsdk.onInit) hostsdk.onInit();
        },
        // 生命周期方法，暂停执行
        onPause: function() {
            if (hostsdk && hostsdk.onPause) hostsdk.onPause();
        },
        // 生命周期方法，恢复执行
        onResume: function() {
            if (hostsdk && hostsdk.onResume) hostsdk.onResume();
        },
        // 生命周期方法，结束执行
        onStop: function() {
            if (hostsdk && hostsdk.onStop) hostsdk.onStop();
        },

        // 发生错误的回调
        errorCallback: function(errorMsg) {},
        // 取消操作后的回调
        cancelCallback: function() {},
        // 操作成功后回调
        successCallback: function() {}
    };

    // 苹果客户端jbridge
    window.setupWebViewJavascriptBridge = function(callback) {
        if (window.WebViewJavascriptBridge) {
            return callback(WebViewJavascriptBridge);
        }
        if (window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(callback);
        }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() {
            document.documentElement.removeChild(WVJBIframe)
        }, 0);
    };

    if (clientTool.isApple) {
        setupWebViewJavascriptBridge(function(bridge) {
            window.ios_hostsdk = bridge;
        });
    }

    // 封装SDK
    var hostsdk = {
        // 初始化时要执行的回调队列
        initCallbacks: [],
        init: function(callback) {
            if (window.host_sdk.initialized) {
                callback();
            }
            window.hostsdk.initCallbacks.push(callback);
        },
        onInit: function() {
            for (var i = 0; i < window.hostsdk.initCallbacks.length; i++) {
                window.hostsdk.initCallbacks[i]();
            }
        },
        share: function(options) {
            if (!window.host_sdk.initialized) {
                location.href = "protocol://share?jsondata=" + JSON.stringify({
                    desc: options.description,
                    url: options.url,
                    title: options.title,
                    icon: options.icon,
                    productid: "",
                    coin: "0"
                });
                return;
            }
            if (options.successCallback) window.host_sdk.successCallback = options.successCallback;
            if (options.errorCallback) window.host_sdk.errorCallback = options.errorCallback;
            if (options.cancelCallback) window.host_sdk.cancelCallback = options.cancelCallback;
            if (clientTool.isApple) {
                ios_hostsdk.callHandler("share", {
                    "title": options.title,
                    "desc": options.description,
                    "url": options.url,
                    "icon": options.icon,
                    "platforms": options.platforms
                });
            } else {
                android_hostsdk.share(options.title, options.url, options.description, options.icon, options.platforms);
            }
        },
        login: function(options) {
            if (!window.host_sdk.initialized) {
                location.href = "protocol://login";
                return;
            }
            if (options.successCallback) window.host_sdk.successCallback = options.successCallback;
            if (options.errorCallback) window.host_sdk.errorCallback = options.errorCallback;
            if (options.cancelCallback) window.host_sdk.cancelCallback = options.cancelCallback;
            if (clientTool.isApple) {
                ios_hostsdk.callHandler("login");
            } else {
                android_hostsdk.login();
            }
        },
        recharge: function(options) {
            if (!window.host_sdk.initialized) {
                location.href = "protocol://recharge?jsondata=" + JSON.stringify({
                    payway: "other"
                });
                return;
            }
            if (options.successCallback) window.host_sdk.successCallback = options.successCallback;
            if (options.errorCallback) window.host_sdk.errorCallback = options.errorCallback;
            if (options.cancelCallback) window.host_sdk.cancelCallback = options.cancelCallback;
            if (clientTool.isApple) {
                ios_hostsdk.callHandler("recharge");
            } else {
                android_hostsdk.recharge();
            }
        },
        downloadBook: function(options) {
            if (!window.host_sdk.initialized) {
                var ids = options.bookId.split(",");
                location.href = "protocol://downloadbook?jsondata=" + JSON.stringify(ids);
                return;
            }
            if (options.successCallback) window.host_sdk.successCallback = options.successCallback;
            if (options.errorCallback) window.host_sdk.errorCallback = options.errorCallback;
            if (clientTool.isApple) {
                ios_hostsdk.callHandler("downloadBook", options.bookId);
            } else {
                android_hostsdk.downloadBook(options.bookId);
            }
        },
        getVip: function(options) {
            if (!window.host_sdk.initialized) {
                location.href = "protocol://getvip";
                return;
            }
            if (options.successCallback) window.host_sdk.successCallback = options.successCallback;
            if (options.cancelCallback) window.host_sdk.cancelCallback = options.cancelCallback;
            if (options.errorCallback) window.host_sdk.errorCallback = options.errorCallback;
            if (clientTool.isApple) {
                ios_hostsdk.callHandler("getVip");
            } else {
                android_hostsdk.getVip();
            }
        },
        openUserCategory: function(options) {
            if (options.successCallback) window.host_sdk.successCallback = options.successCallback;
            if (options.cancelCallback) window.host_sdk.cancelCallback = options.cancelCallback;
            if (options.errorCallback) window.host_sdk.errorCallback = options.errorCallback;
            if (clientTool.isApple) {
                ios_hostsdk.callHandler("openUserCategory");
            } else {
                android_hostsdk.openUserCategory();
            }
        },
        getInfo: function(options) {
            if (!window.host_sdk.initialized) {
                var search = location.href.split("?").length > 1 ? href.split("?")[1] : "";
                if (search.indexOf("#")) {
                    search = search.split("#")[0];
                }
                var params = {};
                var i, p;
                if (search && search.trim().length >= 0) {
                    var strs = search.split("&");
                    for (i = 0; i < strs.length; i++) {
                        p = strs[i].split("=");
                        if (p.length > 1) {
                            params[p[0].toLowerCase()] = p[1];
                        } else {
                            params[p[0].toLowerCase()] = p[0];
                        }
                    }
                }
                params.userId = params.uid;
                if (options.successCallback) options.successCallback(params);
                return;
            }
            if (options.successCallback) window.host_sdk.successCallback = options.successCallback;
            if (options.errorCallback) window.host_sdk.errorCallback = options.errorCallback;
            if (clientTool.isApple) {
                ios_hostsdk.callHandler("getInfo");
            } else {
                android_hostsdk.getInfo();
            }
        },
        openBook: function(bookId, errorCallback) {
            if (!window.host_sdk.initialized) {
                location.href = "protocol://openbook?jsondata=" + JSON.stringify({
                    bookid: bookId
                });
                return;
            }
            if (errorCallback) window.host_sdk.errorCallback = errorCallback;
            if (clientTool.isApple) {
                ios_hostsdk.callHandler("openBook", bookId);
            } else {
                android_hostsdk.openBook(bookId);
            }
        },
        showBookDetail: function(bookId, errorCallback) {
            if (errorCallback) window.host_sdk.errorCallback = errorCallback;
            if (clientTool.isApple) {
                ios_hostsdk.callHandler("showBookDetail", bookId);
            } else {
                android_hostsdk.showBookDetail(bookId);
            }
        },
        openBookList: function(bookListId, errorCallback) {
            if (!window.host_sdk.initialized) {
                location.href = "protocol://seriesbook?jsondata=" + JSON.stringify({
                    seriesid: bookListId
                });
                return;
            }
            if (errorCallback) window.host_sdk.errorCallback = errorCallback;
            if (clientTool.isApple) {
                ios_hostsdk.callHandler("openBookList", bookListId);
            } else {
                android_hostsdk.openBookList(bookListId);
            }
        },
        searchBook: function(keyword, errorCallback) {
            if (!window.host_sdk.initialized) {
                location.href = "protocol://searchbook?jsondata=" + JSON.stringify({
                    keywords: keyword
                });
                return;
            }
            if (errorCallback) window.host_sdk.errorCallback = errorCallback;
            if (clientTool.isApple) {
                ios_hostsdk.callHandler("searchBook", keyword);
            } else {
                android_hostsdk.searchBook(keyword);
            }
        },
        exit: function(errorCallback) {
            if (!window.host_sdk.initialized) {
                location.href = "protocol://exit";
                return;
            }
            if (errorCallback) window.host_sdk.errorCallback = errorCallback;
            if (clientTool.isApple) {
                ios_hostsdk.callHandler("exit");
            } else {
                android_hostsdk.exit();
            }
        },
        setCloseable: function(closable, errorCallback) {
            if (errorCallback) window.host_sdk.errorCallback = errorCallback;
            if (clientTool.isApple) {
                ios_hostsdk.callHandler("setCloseable", closable);
            } else {
                android_hostsdk.setCloseable(closable);
            }
        }
    };
    window.hostsdk = hostsdk;
})();

if (typeof exports !== "undefined") {
    if (typeof module !== "undefined" && module.exports) {
        exports = module.exports = hostsdk;
    }
    exports.hostsdk = hostsdk;
} else if (typeof define === "function" && define.amd) {
    define([], hostsdk);
}
