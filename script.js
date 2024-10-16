(function($) {

    var pluginName = 'flipclock';

    var methods = {
        pad: function(n) {
            return (n < 10) ? '0' + n : n;
        },
        time: function(date) {
            if (date) {
                var e = new Date(date);
                var b = new Date();
                var d = new Date(e.getTime() - b.getTime());
            } else
                var d = new Date();
            var t = methods.pad(date ? d.getHours() : d.getHours())
                    + '' + methods.pad(date ? d.getMinutes() : d.getMinutes());
            return {
                'h': {'d2': t.charAt(0), 'd1': t.charAt(1)},
                'm': {'d2': t.charAt(2), 'd1': t.charAt(3)}
            };
        },
        play: function(c) {
            $('body').removeClass('play');
            var a = $('ul' + c + ' section.active');
            if (a.html() == undefined) {
                a = $('ul' + c + ' section').eq(0);
                a.addClass('ready')
                        .removeClass('active')
                        .next('section')
                        .addClass('active')
                        .closest('body')
                        .addClass('play');
            }
            else if (a.is(':last-child')) {
                $('ul' + c + ' section').removeClass('ready');
                a.addClass('ready').removeClass('active');
                a = $('ul' + c + ' section').eq(0);
                a.addClass('active')
                        .closest('body')
                        .addClass('play');
            }
            else {
                $('ul' + c + ' section').removeClass('ready');
                a.addClass('ready')
                        .removeClass('active')
                        .next('section')
                        .addClass('active')
                        .closest('body')
                        .addClass('play');
            }
        },
        ul: function(c, d2, d1) {
            return '<ul class="flip ' + c + '">' + this.li('d2', d2) + this.li('d1', d1) + '</ul>';
        },
        li: function(c, n) {
            return '<li class="' + c + '"><section class="ready"><div class="up">'
                    + '<div class="shadow"></div>'
                    + '<div class="inn"></div></div>'
                    + '<div class="down">'
                    + '<div class="shadow"></div>'
                    + '<div class="inn"></div></div>'
                    + '</section><section class="active"><div class="up">'
                    + '<div class="shadow"></div>'
                    + '<div class="inn">' + n + '</div></div>'
                    + '<div class="down">'
                    + '<div class="shadow"></div>'
                    + '<div class="inn">' + n + '</div></div>'
                    + '</section></li>';
        }
    };

    function Plugin(element, options) {
        this.element = element;
        this.options = options;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            var t, full = false;

            if (!this.options || this.options == 'clock') {
                t = methods.time();
            } else {
                t = methods.time(this.options);
                full = true;
            }

            $(this.element)
                    .addClass('flipclock')
                    .html(
                    methods.ul('hour', t.h.d2, t.h.d1)
                    + methods.ul('minute', t.m.d2, t.m.d1)
                    + '<audio id="flipclick">');

            setInterval($.proxy(this.refresh, this), 60000); // Güncellemeyi dakika başına ayarladık
        },

        refresh: function() {
            var el = $(this.element);
            var t = methods.time();

            setTimeout(function() {
                document.getElementById('flipclick').play()
            }, 500);

            // minute first digit
            el.find(".minute .d1 .ready .inn").html(t.m.d1);
            methods.play('.minute .d1');
            // minute second digit
            el.find(".minute .d2 .ready .inn").html(t.m.d2);
            methods.play('.minute .d2');
            // hour first digit
            el.find(".hour .d1 .ready .inn").html(t.h.d1);
            methods.play('.hour .d1');
            // hour second digit
            el.find(".hour .d2 .ready .inn").html(t.h.d2);
            methods.play('.hour .d2');
        },
    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$(this).data('plugin_' + pluginName)) {
                $(this).data('plugin_' + pluginName,
                        new Plugin(this, options));
            }
        });
    };

})(typeof jQuery !== 'undefined' ? jQuery : Zepto);

// RUN
$('#container').flipclock();
