$(document).ready(function () {
    if ($('.md-input .text').val().length > 0) {
        $('.md-input .hint').addClass("md-input-animate-hint");
    }
    $('.md-input .text').focus(function () {

        var textLength = $('.md-input .text').val().length;
        if (textLength <= 0) {
            $('.md-input .hint').addClass("md-input-animate-hint");
            $('.md-input .hint').css('color', '#3F51B5')
            $('.md-input .hint').css('opacity', '1')
        }
        $('.md-input .divider2').addClass("md-input-animate-divider");
    });
    $('.md-input .text').focusout(function () {
        var textLength = $('.md-input .text').val().length;
        if (textLength <= 0) {
            $('.md-input .hint').removeClass("md-input-animate-hint");
            $('.md-input .hint').css('color', '#444')
            $('.md-input .hint').css('opacity', '0.6')
        }
        $('.md-input .divider2').removeClass("md-input-animate-divider");
    });

    function isURL(s) {
        var regexp = /[a-zA-Z-0-9]+\.[a-zA-Z-0-9]{2,3}/;
        return regexp.test(s);
    }
    $('.text').keypress(function (e) {
        //if enter key was pressed
        if (e.which == 13) {
            if (!$('.text').val().startsWith("webexpress://")) {
                if (isURL($('.text').val())) {
                    if ($('.text').val().startsWith("http://") || $('.text').val().startsWith("https://") || $('.text').val().startsWith("file://")) {
                        window.location.href = $('.text').val();
                    } else {
                        window.location.href = "http://" + $('.text').val()
                    }
                } else {
                    //TODO: search engines
                    window.location.href = "http://www.google.com/search?q=" + $('.text').val();
                }
            } else {
                window.location.href = $('.text').val();
            }

            return false;
        }
    });

    function makeRippleMenuItem(menuItem, e) {
        var relX = e.pageX - $(menuItem).offset().left;
        var relY = e.pageY - $(menuItem).offset().top;
        Ripple.makeRipple($(menuItem), relX, relY, $(menuItem).width(), $(menuItem).height(), 500, 0);
    }

    $('.bookmarks a').mousedown(function (e) {
        makeRippleMenuItem($(this), e);
    });
    var marginRight = 8;
    $('.bookmarks').css('width', $('.bookmarks a').width() * 3 + 3 * marginRight);
});