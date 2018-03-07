(function (callback) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = callback();
        return;
    }
    if (typeof define === 'function' && define.amd) {
        define([],callback);
        return;
    }
    window.BookStore = callback(window.$, window.md5, window.browser);
})(function () {
    var store = {
        get: function (key) {
            var value = store.getCookie(key);
            if (typeof value !== "object" && value != null) {
                value = JSON.parse(value);
            }
            var localValue = store.getLocal(key);
            if (value == null) {
                return localValue;
            }
            if (value === "") {
                return localValue;
            }
            store.mix(value, localValue);
            return value;
        },
        set: function (key, value) {
            if (typeof (value) === "object") {
                value = JSON.stringify(value);
            }
            store.setCookie(key, value);
            store.setLocal(key, value);
        },
        cookie: {
            get: function (key) {
                var reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
                var arr = document.cookie.match(reg);
                if (arr) {
                    var value = unescape(arr[2]);
                    return value;
                }
                return null;
            },
            set: function (key, value) {
                if (typeof (value) === "object") {
                    value = JSON.stringify(value);
                }
                var exp = new Date();
                exp.setTime(exp.getTime() + 30 * 24 * 60 * 60 * 1000);
                document.cookie = key + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString();
            }
        },
        setCookie: function (key, value) {
            store.cookie.set(key, value);
        },
        getCookie: function (key) {
            var value = store.cookie.get(key);
            if (typeof value !== "object" && value != null) {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    return value;
                }
            }
            return value;
        },
        setLocal: function (key, value) {
            if (!window.localStorage) return;
            if (typeof (value) === "object") {
                value = JSON.stringify(value);
            }
            var storage = window.localStorage;
            storage.removeItem(key);
            storage.setItem(key, value);
        },
        getLocal: function (key) {
            if (!window.localStorage) return;
            var storage = window.localStorage;
            var value = storage.getItem(key);
            if (typeof (value) !== "object") {
                value = JSON.parse(value);
            }
            return value;
        },
        mix: function (one, two) {
            if ((typeof one !== "object") || (typeof two !== "object")) {
                return;
            }
            for (k in two) {
                if (typeof one[k] === "undefined") {
                    one[k] = two[k];
                } else {
                    store.mix(one[k], two[k]);
                }
            }
        }
    }

    store.setBookReadHistory = function (bookId, bookName, chapterId, chapterName) {
        var list = store.getBookReadHistory();
        if (!list) {
            list = [];
        }
        var book;

        var timestamp = Date.parse(new Date()) / 1000;
        for (var i = 0; i < list.length; i++) {
            book = list[i];
            if (book.bid === bookId) {
                list.splice(i, 1);
                i--;
            }
        }
        list.unshift({ bid: bookId, bname: bookName, cid: chapterId, cname: chapterName, date: timestamp });
        if (list.length > 10) {
            list = list.slice(0, 10);
        }
        store.set("bookReadHistory", list);
    }

    store.getBookReadHistory = function () {
        var list = store.get("bookReadHistory");
        var newList = [];
        var json = {};
        var book;

        // ШЅжи
        for (var j = 0; list && j < list.length; j++) {
            book = list[j];
            if (!json["b_" + book.bid]) {
                newList.push(book);
                json["b_" + book.bid] = true;
            }
        }
        list = newList;
        return list;
    };
    return store;
});
