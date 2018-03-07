define(["jquery", "commons/Browser"], function ($, browser) {
    if (browser.isWannianli) {
        $(".action-bar .back").hide();
    }
});