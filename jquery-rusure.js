(function ($) {
    'use strict';

    var defaults = {
        message: 'Unsaved changes will be lost if you leave this page!'
    },

    methods = {
        trigger: function (unloadCallback) {
            if (!unloadCallback) {
                throw 'unloadCallback not defined';
            }

            var $body = $('body'),
                $this = $(this),
                $iframe = $body.find('iframe.rusure-iframe'),
                state = $this.data('rusure-state'),
                unloadCallbackProxy = $.proxy(function () {
                    unloadCallback.apply(this);
                    $body.find('iframe.rusure-iframe').remove();
                }, this);

            if ($this.serialize() !== state.initial) {
                if ($iframe.length === 0) {
                    $iframe = $('<iframe class="rusure-iframe" />');

                    $iframe.css({
                        position: 'absolute',
                        top: '-1px',
                        width: '0px',
                        height: '0px'
                    });

                    $iframe.one('load', function () {
                        var win = $(this.contentWindow);
                        win.on('beforeunload', state.beforeUnloadHandler);
                        win.on('unload', unloadCallbackProxy);
                    });

                    $body.append($iframe);
                }

                $iframe.attr('src', 'javascript:void(0)');

            } else {
                unloadCallbackProxy.apply();
            }
        }
    };

    $.fn.rusure = function () {
        var method, args, options = {};

        if (arguments.length > 0) {
            method = methods[arguments[0]];

            if (method) {
                args = Array.prototype.slice.call(arguments, 1);
            } else {
                options = $.extend(options, defaults, arguments[0]);
            }
        }

        this.each(function () {
            var $this = $(this);

            if (method) {
                method.apply(this, args);
            } else {
                var state = {
                    submitted: false,
                    initial: $this.serialize(),
                    beforeUnloadHandler: function (e) {
                        if (!state.submitted && $this.is(':visible') && $this.serialize() !== state.initial) {
                            return options.message;
                        }
                        state.submitted = false;
                    }
                };

                $this.data('rusure-state', state);

                $this.on('submit', function (e) {
                    state.submitted = true;
                });

                $(window).on('beforeunload', state.beforeUnloadHandler);
            }
        });
    }
})(jQuery);
