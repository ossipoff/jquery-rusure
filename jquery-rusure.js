(function ($) {
    'use strict';

    var defaults = {
        message: 'Unsaved changes will be lost if you leave this page!'
    },

    methods = {
        trigger: function (unloadCallback, state) {
            if (!unloadCallback) {
                throw 'unloadCallback not defined';
            }

            var $body = $('body'),
                $this = $(this),
                $iframe = $body.find('iframe.rusure-iframe'),
                unloadCallbackProxy = $.proxy(function () {
                    unloadCallback.apply(this);
                    $body.find('iframe.rusure-iframe').remove();
                }, this);

            function navigateAway(win) {
                win.location = "";
            }

            state = $.extend($this.data('rusure-state'), state);

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
                        var win = this.contentWindow,
                            $win = $(this.contentWindow);
                        $win.on('beforeunload', state.beforeUnloadHandler);
                        $win.on('unload', unloadCallbackProxy);
                        navigateAway(win);
                    });

                    $body.append($iframe);
                } else {
                    navigateAway($iframe[0].contentWindow);
                }

            } else {
                unloadCallbackProxy.apply();
            }
        },
        updatestate: function (newState) {
            var $this = $(this),
                state = $this.data('rusure-state');

            state.initial = $this.serialize();

            $.extend(state, newState);
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
                    if (!e.isDefaultPrevented()) {
                        state.submitted = true;
                    }
                });

                $(window).on('beforeunload', state.beforeUnloadHandler);
            }
        });
    }

    $.fn.rusure.defaults = defaults;
})(jQuery);
