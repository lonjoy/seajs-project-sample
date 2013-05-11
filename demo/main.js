define(function (require, exports, module) {
    var $ = require('marketing/zepto/1.0.0/zepto');
    require('marketing/slider/1.0.0/slider');
    require('./lib/more-business.js');

    $("#slider").slider({
        prev: ".prev",
        next: ".next",
        loop: true,
        play: true
    });
});
