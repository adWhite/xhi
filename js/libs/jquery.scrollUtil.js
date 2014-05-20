// scrollUtil.js 0.0.1
// http://thinkxl.github.io/scrollUtil.js
// (c) 2014 Juan Olvera
// scrollUtil.js may be freely distributed under the MIT license.

// ## TODO
// make a version with no *dependencies*

(function(root) {
    var lib = {
        // Scroll the to an `#id` with a smooth transition 
        goTo: function(id) {
            var target = $(id).offset().top - 60;
            $('html, body').animate({scrollTop:target}, 500);
        },

        // Disallow scrolling on `body`
        stopScroll:function() {
            $('body').on('mousewheel touchmove', function(e) {
                e.preventDefault();
            });
        },

        // Allow scrolling back again
        allowScroll: function() {
            $('body').off('mousewheel touchmove');
        }
    };

    root.scrollUtil = lib;
})(this); 
