addEvent(document, 'ready', function() {
    // header
    if (header.active_key) {
        var active_item = Selector.query('#menu *[data-key="' + header.active_key + '"]');

        if (active_item) {
            active_item.addClass('active');
        }

        var sub_menus = header.active_key.split('/');

        while(sub_menus.length > 1) {
            sub_menus.splice(sub_menus.length - 1);

            active_item = Selector.query('#menu *[data-key="' + sub_menus.join('/') + '"]');

            if (active_item) {
                active_item.addClass('active');
            }
        }
    }
});