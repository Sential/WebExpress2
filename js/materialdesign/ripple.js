var Ripple = class Ripple {
    static makeRipple(element, xpos, ypos, height, width, time, fadeoutopacity) {
        var $rippleElement = $('<span class="ripple-effect" />'),
            $buttonElement = element,
            btnOffset = $buttonElement.offset(),
            xPos = xpos,
            yPos = ypos,
            size = 0,
            animateSize = parseInt(Math.max(width, height) * Math.PI);
        $rippleElement
            .css({
                top: yPos,
                left: xPos,
                width: size,
                height: size,
                backgroundColor: $buttonElement.attr("data-ripple-color")
            })
            .appendTo($buttonElement)
            .animate({
                width: animateSize,
                height: animateSize,
            }, time, 'linear', function () {

            });
        $(element).mouseup(function () {
            $rippleElement.animate({
                opacity: fadeoutopacity
            }, {
                duration: time,
                queue: false,
                complete: function () {
                    
                }
            })
        })
        $(element).on('mouseout', function () {
            $rippleElement.animate({
                opacity: fadeoutopacity
            }, {
                duration: time,
                queue: false,
                complete: function () {
                   
                }
            })
        })
        return $rippleElement
    }
};