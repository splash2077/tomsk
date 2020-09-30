(function($) {
    'use strict';

    if ($.fn.menumaker) {
        $("#cssmenu").menumaker({
            title: "Menu", // The text of the button which toggles the menu
            breakpoint: 768, // The breakpoint for switching to the mobile view
            format: "multitoggle" // It takes three values: dropdown for a simple toggle menu, select for select list menu, multitoggle for a menu where each submenu can be toggled separately
        });
    }
    if ($.fn.owlCarousel) {
        var mainslider = $(".main-slider").owlCarousel({
            items: 1,
            nav: true,
            loop: true,
            autoplay: true,
            navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
            smartSpeed: 1500,
            dots: false,
        });
        $(".customer-slider-active").owlCarousel({
            items: 1,
            nav: true,
            loop: true,
            autoplay: true,
            navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
            smartSpeed: 1000,
            dots: false,
            animateIn: 'fadeIn',
            animateOut: 'fadeOut'
        });
        $(".project-image-slider").owlCarousel({
            items: 1,
            nav: false,
            loop: true,
            autoplay: true,
            navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
            smartSpeed: 1000,
            dots: false,
            animateIn: 'fadeIn',
            animateOut: 'fadeOut'
        });
    }
    $(window).on('load', function() {
        $('#prealoader').fadeOut('slow', function() {
            $(this).remove();
        });
    });

    // add animate.css class(es) to the elements to be animated
    function setAnimation(_elem, _InOut) {
        // Store all animationend event name in a string.
        // cf animate.css documentation
        var animationEndEvent = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

        _elem.each(function() {
            var $elem = $(this);
            var $animationType = 'animated ' + $elem.data('animation-' + _InOut);

            $elem.addClass($animationType).one(animationEndEvent, function() {
                $elem.removeClass($animationType); // remove animate.css Class at the end of the animations
            });
        });
    }


    // Fired before current slide change
    mainslider.on('change.owl.carousel', function(event) {
        var $currentItem = $('.owl-item', mainslider).eq(event.item.index);
        var $elemsToanim = $currentItem.find("[data-animation-out]");
        setAnimation($elemsToanim, 'out');
    });

    // Fired after current slide has been changed
    var round = 0;
    mainslider.on('changed.owl.carousel', function(event) {
        var $currentItem = $('.owl-item', mainslider).eq(event.item.index);
        var $elemsToanim = $currentItem.find("[data-animation-in]");

        setAnimation($elemsToanim, 'in');
    });
    if ($.fn.owlCarousel) {
        $(".brand-slider-active").owlCarousel({
            items: 5,
            nav: true,
            loop: true,
            autoplay: true,
            navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
            smartSpeed: 1000,
            dots: false,
            margin: 50,
            responsive: {
                0: {
                    items: 2,
                    nav: false,
                    margin: 20
                },
                600: {
                    items: 3,
                    nav: false
                },
                1000: {
                    items: 5,
                    nav: false,
                }
            }
        });
        $(".team-slider-active").owlCarousel({
            items: 4,
            nav: true,
            loop: true,
            autoplay: true,
            navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
            smartSpeed: 1000,
            dots: false,
            margin: 30,
            responsive: {
                0: {
                    items: 1,
                    nav: false,
                    margin: 20
                },
                600: {
                    items: 2,
                },
                1000: {
                    items: 4,
                }
            }
        });
        $(".blog-slider-active").owlCarousel({
            items: 3,
            nav: true,
            loop: true,
            autoplay: true,
            navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
            smartSpeed: 1000,
            dots: false,
            margin: 30,
            responsive: {
                0: {
                    items: 1,
                    nav: false,
                    margin: 0
                },
                600: {
                    items: 2,
                    nav: false
                },
                1000: {
                    items: 3,
                    nav: false,
                }
            }
        });
    }
    // if ($.fn.AniView) {
    //     $('.aniview').AniView({
    //         animateThreshold: 50,
    //         scrollPollInterval: 10
    //     });
    // }

    if ($.fn.magnificPopup) {
        $('.videplay').magnificPopup({
            type: 'iframe'
        });
        $('.view-image').magnificPopup({
            type: 'image',
            gallery: {
                enabled: true
            },
        });
    }
    if ($.fn.isotope) {
        $('.isotop-active').isotope({
            filter: '*',
        });

        $('.portfolio-nav li').on('click', function() {
            $(this).addClass('active').siblings(this).removeClass('active');
            var selector = $(this).data('filter');
            $('.isotop-active').isotope({
                filter: selector,
            });
        });

    }
})(jQuery);