define(["jquery"], function ($) {
    var el = $("[data-init]");
    if (el.length === 0) {
        return '{}';
    }
    var data = el.html() || '{}';
    el.remove();
    return data;
});