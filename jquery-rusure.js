(function ($) {
    'use strict';

    var defaults = {
        message: 'Unsaved changes will be lost if you leave this page!'
    };

    $.fn.rusure = function (options) {
        options = $.extend({}, defaults, options)

        this.each(function () {
            var $this = $(this),
                submitted = false,
                initialState = $this.serialize();

            $this.on('submit', function (e) {
                submitted = true;
            });

            $(window).on('beforeunload', function (e) {
                if (!submitted && $this.is(':visible') && $this.serialize() !== initialState) {
                    return options.message;
                }
                submitted = false;
            });
        });
    }
})(jQuery);
