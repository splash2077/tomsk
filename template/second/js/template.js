/**
 * Created Kozlov AB
 *
 * Version 4.1.0.0
 */

// Get Elements
var html = null;
var body = null;

// Clear HTML elements
var library_data = {
    empty: {
        div: null
        , img: null
        , script: null
        , form: null
        , input: null
        , textarea: null
    }
    , xhr: null
};

/**
 * Get Height and Width of window
 *
 * @returns {object} - Window sizes in object
 */
function getWindowSizes() {
    return {
        height: window.innerHeight || html.clientHeight || body.clientHeight
        , width: window.innerWidth || html.clientWidth || body.clientWidth
    }
}

/**
 * Add cross browser event to DOM element
 *
 * @param {element/array} element - Element for adding event
 * @param {string/array}  name    - Event name
 * @param {function}      handler - Event handler
 */
function addEvent(element, name, handler) {
    if (isArray(element) ||
        isArray(name)) {

        if (isArray(element)) {
            element.map(function(element_item) {
                if (isArray(name)) {
                    name.map(function(name_item) {
                        addEvent(element_item, name_item, handler);
                    });
                } else {
                    addEvent(element_item, name, handler);
                }
            });
        } else {
            name.map(function(name_item) {
                addEvent(element, name_item, handler);
            });
        }
        return;
    }

    if (name == 'ready') {
        element = document;
        if (element.addEventListener) {
            element.addEventListener('DOMContentLoaded', handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('onreadystatechange', function() {
                if (element.readyState === 'complete' ) {
                    handler();
                }
            });
        }
    } else {
        if (element.addEventListener) {
            element.addEventListener(name, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + name, handler);
        }
    }
}

/**
 * Remove cross browser event to DOM element
 *
 * @param {element/array} element - Element for adding event
 * @param {string/array}  name    - Event name
 * @param {function}      handler - Event handler
 */
function removeEvent(element, name, handler) {
    if (isArray(element) ||
        isArray(name)) {

        if (isArray(element)) {
            element.map(function(element_item) {
                if (isArray(name)) {
                    name.map(function(name_item) {
                        removeEvent(element_item, name_item, handler);
                    });
                } else {
                    removeEvent(element_item, name, handler);
                }
            });
        } else {
            name.map(function(name_item) {
                removeEvent(element, name_item, handler);
            });
        }
        return;
    }

    if (element.addEventListener) {
        element.removeEventListener(name, handler, false);
    } else if (element.attachEvent) {
        element.detachEvent('on' + name, handler);
    }
}

addEvent(document, 'ready', function() {
    html = document.documentElement;
    body = document.getElementsByTagName('body')[0];

    for (var index in library_data.empty) {
        library_data.empty[index] = document.createElement(index);
    }
});


/**
 * Cross browser prevent default
 *
 * @param event	- Event handler
 */
Event.prototype.prevent = function() {
    if (this.preventDefault) {
        this.preventDefault();
    } else if (this.getPreventDefault) {
        this.getPreventDefault();
    } else {
        this.defaultPrevented;
    }
    this.returnValue = false;
}


// Math extension functions
Math.easeInOutQuad = function(t, b, c, d) {
    t /= d / 2;
    if (t < 1) {
        return c / 2 * t * t + b;
    }
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
};
Math.easeInCubic = function(t, b, c, d) {
    var tc = (t /= d) * t * t;
    return b + c * (tc);
};
Math.inOutQuintic = function(t, b, c, d) {
    var ts = (t /= d) * t;
    var tc = ts * t;
    return b + c * (6 * tc * ts + -15 * ts * ts + 10 * tc);
};

/**
 * Scroll events
 *
 * Methods:
 *  keys - Array with keys for disabled
 *
 *  get - Get scroll position
 *      @param {string/integer} value   - Scroll top position {'top'/'bottom'/integer}
 *      @param {object}         element - (optional) Scroll element
 *      @returns {integer}              - Scroll top position
 *
 *  set - Set scroll position
 *      @param {string/integer} value   - Scroll top position {'top'/'bottom'/integer}
 *      @param {object}         element - (optional) Scroll element
 *
 *  disable   - Disabled scroll events
 *      @param {object}         element - (optional) Scroll element
 *
 *  enable    - Enabled scroll events
 *      @param {object}         element - (optional) Scroll element
 *
 *  smooth - Smooth scroll to position
 *      @param {object}         element  - (optional) HTMLElement or null (null -> html or body)
 *      @param {integer}        to       - Scroll position
 *      @param {integer}        duration - (optional) Animation duration (ms) (200ms by default)
 *      @param {function}       callback - (optional) Callback function after scrolling
 */
var Scroll = {
    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    keys: [32, 33, 34, 35, 36, 37, 38, 39, 40]
    , _prevent: function(event) {
        (event || window.event).prevent();
    }
    , _preventKeys: function(event) {
        if (Scroll.keys.inArray(event.keyCode)) {
            Scroll._prevent(event);
            return false;
        }
    }
    , get: function(element) {
        if (isElement(element)) {
            return element.scrollTop;
        }

        if ( ! html ||
            ! body) {
            html = document.documentElement;
            body = document.getElementsByTagName('body')[0];
        }
        return html.scrollTop || body.scrollTop;
    }
    , set: function(value, element) {
        if (typeof value == 'string') {
            switch (value) {
                case 'top':
                    value = 0;
                    break;
                case 'bottom':
                    value = isElement(element) ? element.children[0].clientHeight : body.clientHeight;
                    break;
                default:
                    return;
            }
        }

        if (typeof value != 'number') {
            return;
        }

        if (isElement(element)) {
            element.scrollTop = value.toFixed(0);
        } else {
            html.scrollTop = value.toFixed(0);
            body.scrollTop = value.toFixed(0);
        }
    }
    , disable: function(element) {
        addEvent((element || window), 'scroll', this._prevent);
        addEvent((element || document), 'keydown', this._preventKeys);
    }
    , enable: function(element) {
        removeEvent((element || window), 'scroll', this._prevent);
        removeEvent((element || document), 'keydown', this._preventKeys);
    }
    , smooth: function(element, to, duration, callback) {
        if ( ! isInteger(to)) {
            return;
        }

        var self = this;

        duration = (typeof duration == 'undefined') ? 200 : duration;

        var start = this.get(element);
        var distance = to - start;
        var current_time = 0;
        var increment = 20;

        var animateScroll = function() {

            if (distance != (to - start)) {
                start = self.get(element);
                distance = to - start;
                current_time = 0;
            }

            current_time += increment;

            self.set(Math.inOutQuintic(current_time, start, distance, duration), element);

            if (current_time < duration) {
                (function() {
                    return window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        function(callback) {
                            setTimeout(callback, 1000 / 60);
                        };
                })()(animateScroll);
            } else if (isFunction(callback)) {
                callback();
            }
        };

        animateScroll();
    }
};

/**
 * Cookie methods
 *
 * Methods:
 *  get - Get cookie 'value' by 'name'
 *      @param {string} name     - Cookie name
 *      @returns {string}        - Cookie value or ''
 *
 *  set - Set cookie 'value' by 'name'
 *      @param {string} name     - Cookie name
 *      @param {string} value    - Cookie value
 *      @param {object} settings - (optional) Cookie settings
 *          {
 *              @param {integer} expires - (optional) (365 days by default) Days cookie expires
 *              @param {string}  domain  - (optional) (current domain by default) Cookie scope domain
 *              @param {string}  path    - (optional) ('/' by default) Cookie scope path
 *  		}
 *
 *  delete - Delete cookie by 'name'
 *      @param {string} name     - Cookie name
 */
var Cookie = {
    get: function(name) {
        var arr_cookies = document.cookie.split(';');
        for (var cookie_index in arr_cookies) {
            var cookie_item = arr_cookies[cookie_index].trim().split('=');
            if (cookie_item[0] == name) {
                return cookie_item[1];
            }
        }
        return '';
    }
    , set: function(name, value, settings) {
        if ( ! name) {
            return;
        }

        if ( ! settings) {
            settings = {};
        }

        var data = {};

        var date = new Date();
        date.setTime(date.getTime() + ((settings.expires || 365) * 24 * 60 * 60 * 1000));

        data[name] = value;
        data.expires = date.toUTCString();
        data.domain = settings.domain || window.location.hostname;
        data.path = settings.path || '/';

        document.cookie = Object.keys(data)
            .map(function(key) {
                return key + '=' + data[key];
            }).join('; ');
    }
    , delete: function(name) {
        this.set(name, '', { expires: -1 });
    }
};

/**
 * Redirect to action with obj_data
 *
 * @param {string} action   - Action for form
 * @param {object} obj_data - Object with params
 * @param {string} method   - (optional) Send method ('post'(by default)/'get')
 */
function redirectWithForm(action, obj_data, method) {

    library_data.empty.form.innerHTML = '';

    library_data.empty.form.method = method || 'post';
    library_data.empty.form.action = action;
    library_data.empty.form.enctype = 'application/x-www-form-urlencoded';

    for (var name in obj_data) {
        var clone = library_data.empty.input.cloneNode(true);
        clone.type = 'hidden';
        clone.name = name;
        clone.value = obj_data[name];
        library_data.empty.form.appendChild(clone);
    }

    body.appendChild(library_data.empty.form);
    setTimeout(function() {
        library_data.empty.form.submit();
    });
}


/** Methods for class name manipulation */
/**
 * Get outer html element or set inner html
 *
 * @param {string}  html    - HTML for paste
 * @param {boolean} replace - (optional) Remove current element childrens
 * @returns {string} - Return outer HTML (for get) || undefined (for set)
 */
Element.prototype.html = function(html, replace) {
    if (html) {
        if (replace) {
            this.innerHTML = '';
        }

        library_data.empty.div.innerHTML = html;

        for (var index in library_data.empty.div.children) {
            if (isElement(library_data.empty.div.children[index])) {
                this.appendChild(library_data.empty.div.children[index].cloneNode(true));
            }
        }

        library_data.empty.div.innerHTML = '';
        return;
    }

    if (this.outerHTML) {
        return this.outerHTML;
    }

    library_data.empty.div.appendChild(this.cloneNode(true));
    var result = library_data.empty.div.innerHTML;
    library_data.empty.div.innerHTML = '';
    return result;
};

/**
 * Add class name to element
 *
 * @param {string} class_name - Class name for adding
 * @returns {HTMLElement} - this
 */
Element.prototype.addClass = function(class_name) {
    if ( ! this.hasClass(class_name)) {
        if (this.classList) {
            this.classList.add(class_name);
        } else {
            var classes = this.className.split(' ');
            classes.push(class_name);
            this.className = classes
                .filter(function(item_class) {
                    return item_class;
                }).join(' ');
        }
    }

    return this;
};

/**
 * Remove class name from element
 *
 * @param {string} class_name - Class name for removing
 * @returns {HTMLElement} - this
 */
Element.prototype.removeClass = function(class_name) {
    if (this.hasClass(class_name)) {
        if (this.classList) {
            this.classList.remove(class_name);
        } else {
            var classes = this.className.split(' ');
            this.className = classes
                .filter(function(item_class) {
                    return item_class && item_class != class_name;
                }).join(' ');
        }
    }

    return this;
};

/**
 * Toggle class name an element
 *
 * @param {string} class_name - Class name for toggle
 * @returns {HTMLElement} - this
 */
Element.prototype.toggleClass = function(class_name) {
    if (this.classList) {
        this.classList.toggle(class_name);
        return this;
    }

    if (this.hasClass(class_name)) {
        this.removeClass(class_name);
    } else {
        this.addClass(class_name);
    }

    return this;
};

/**
 * Exist class name an element
 *
 * @param {string} class_name - Class name for existing checking
 * @returns {boolean} - Class exist
 */
Element.prototype.hasClass = function(class_name) {
    if (this.classList) {
        return this.classList.contains(class_name);
    }
    return (this.className.indexOf(class_name) > -1);
};

/**
 * Get offset (top, left) element
 *
 * @returns {object} - Offset for current element
 */
Element.prototype.offset = function() {
    var offset = {
        top: 0
        , left: 0
    };

    var element = this;

    while (element) {
        offset.top += element.offsetTop;
        offset.left += element.offsetLeft;
        element = element.offsetParent;
    }

    return offset;
};

/**
 * Remove element from DOM
 */
Element.prototype.remove = function() {
    this.parentNode.removeChild(this);
};

/**
 * Get element style value
 *
 * @param   {string} style - Style name
 * @returns {string} - Style value
 */
Element.prototype.getCSS = function(style) {
    var computedStyle = null;
    if (typeof this.currentStyle == 'undefined') {
        computedStyle = document.defaultView.getComputedStyle(this, null);
    } else {
        computedStyle = this.currentStyle;
    }
    return computedStyle[style];
};


/** Methods for strings */
/**
 * Encode HTML string
 *
 * @returns {string} - Encoded string
 */
String.prototype.encode = function() {
    return this.replace(/[&<>"']/g, function($0) {
        return '&' + {'&':'amp', '<':'lt', '>':'gt', '"':'quot', "'":'#39'}[$0] + ';';
    });
};

/**
 * Decode HTML string
 *
 * @param {boolean} raw_url_encode - Encode string after PHP rawurlencode()
 * @returns {string} - Decoded string
 */
String.prototype.decode = function(raw_url_encode) {
    if (raw_url_encode) {
        return decodeURIComponent(this).replace(/\x22|%22/g, '"');
    }
    library_data.empty.textarea.innerHTML = this;
    return library_data.empty.textarea.value;
};

/**
 * Replace all substrings in string with symbols escaping
 *
 * @param {string}  reg_exp       - Regular expression pattern
 * @param {string}  new_substring - New substring
 * @param {boolean} escape	      - Escape string
 * @returns {string} - Replaced string
 */
String.prototype.replaceAll = function(reg_exp, new_substring, escape) {
    if (escape) {
        new_substring = new_substring.encode();
    }
    return this.replace(new RegExp(reg_exp, 'g'), function() { return new_substring; });
};

/**
 * Replace all placeholders in string with symbols escaping
 *
 * @param {string}  reg_exp       - Regular expression pattern
 * @param {string}  new_substring - New substring
 * @param {boolean} escape	      - Escape string
 * @returns {string} - Replaced string
 */
String.prototype.replacePHs = function(reg_exp, new_substring, escape) {
    return this.replaceAll(('%%' + reg_exp + '%%'), new_substring, escape);
};

/**
 * Make string to capitalize style
 *
 * @returns {string} - Capitalize string
 */
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};

/**
 * Repeat string X count
 *
 * @param {integer} num - Count repeat
 * @returns {string} - Repeatable string
 */
String.prototype.repeat = function(num) {
    if ( ! isInteger(num)) {
        return this;
    }
    return new Array(num * 1 + 1).join(this);
};


/** Methods for array */
/**
 * Isset value on array
 *
 * @returns {boolean} - Comparse result
 */
Object.defineProperty(Array.prototype, 'inArray', {
    enumerable: false
    , value: function(item) {
        return (this.indexOf(item) > -1);
    }
});

/**
 * Get min value from array
 *
 * @returns {number} - Min value from array
 */
Object.defineProperty(Array.prototype, 'min', {
    enumerable: false
    , value: function() {
        return Math.min.apply(Math, this);
    }
});

/**
 * Get max value from array
 *
 * @returns {number} - Max value from array
 */
Object.defineProperty(Array.prototype, 'max', {
    enumerable: false
    , value: function() {
        return Math.max.apply(Math, this);
    }
});

/**
 * Get shuffle source array
 *
 * @returns {array} - Array after shuffling
 */
Object.defineProperty(Array.prototype, 'shuffle', {
    enumerable: false
    , value: function() {
        for (var j, x, i = this.length; i; j = Math.floor(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
        return this;
    }
});


/** Methods for object */
/**
 * Return object length
 *
 * @returns {integer} - Count fields and methods on object
 */
Object.defineProperty(Object.prototype, 'length', {
    enumerable: false
    , value: function() {
        var self = this;
        return Object.keys(this)
            .map(function(key) {
                return self[key];
            }).length;
    }
});

/**
 * Serialize object to string for GET request
 *
 * @returns {string} - Object as Get params string
 */
Object.defineProperty(Object.prototype, 'serialize', {
    enumerable: false
    , value: function() {
        var self = this;
        return Object.keys(this)
            .reduce(function(arr, key) {
                if (isArray(self[key])) {
                    self[key].map(function(value) {
                        arr.push(key + '[]=' + encodeURIComponent(value));
                    });
                } else {
                    arr.push(key + '=' + encodeURIComponent(self[key]));
                }
                return arr;
            }, [])
            .join('&');
    }
});


/** Object for select elements */
/**
 * Get element(s) by selector
 *
 * Methods:
 *  id - Get element by Id from document
 *      @param {string} id - Id element without hash (#)
 *      @returns {HTMLElement/undefined} - Select result
 *
 *  query - Get element by CSS selector from document
 *      @param {string} selector  - CSS selector
 *      @returns {HTMLElement/undefined} - Select result
 *
 *  queryAll - Get elements by CSS selector from document
 *      @param {string} selector  - CSS selector
 *      @returns {array} - Select result
 */
var Selector = {
    id: function(id) {
        return document.getElementById(id);
    }
    , query: function(selector) {
        return document.querySelector(selector);
    }
    , queryAll: function(selectors) {
        return [].slice.call(document.querySelectorAll(selectors));
    }
}


/**
 * Get random integer between min and max
 *
 * @param {integer} min - Min range value
 * @param {integer} max - Max range value
 * @returns {integer} - Random integer between min and max
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/** Type checkings */
/**
 * Checking for array type
 *
 * @param {object} obj - Object for checking
 * @returns {boolean} - Checking result
 */
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

/**
 * Checking for integer type
 *
 * @param {string/number} num - Number or string for checking
 * @returns {boolean} - Checking result
 */
function isInteger(num) {
    if (typeof num != 'string' &&
        typeof num != 'number') {
        return false;
    }
    num *= 1;
    return num === Number(num) && num % 1 === 0;
}

/**
 * Checking for float type
 *
 * @param {string/number} num - Number or string for checking
 * @returns {boolean} - Checking result
 */
function isFloat(num) {
    if (typeof num != 'string' &&
        typeof num != 'number') {
        return false;
    }
    num *= 1;
    return num === Number(num) && num % 1 !== 0;
}

/**
 * Checking for DOM element
 *
 * @param {object} obj - Object for checking
 * @returns {boolean} - Checking result
 */
function isElement(obj) {
    return (typeof HTMLElement == 'object' ?
            obj instanceof HTMLElement : //DOM2
            (obj &&
                obj !== null &&
                typeof obj == 'object' &&
                obj.nodeType === 1 &&
                typeof obj.nodeName == 'string')
    );
}

/**
 * Checking for DOM node
 *
 * @param {object} obj - Object for checking
 * @returns {boolean} - Checking result
 */
function isNode(obj) {
    return (typeof Node == 'object' ?
            obj instanceof Node :
            (obj &&
                obj !== null &&
                typeof obj == 'object' &&
                typeof obj.nodeType == 'number' &&
                typeof obj.nodeName == 'string')
    );
}

/**
 * Checking for function
 *
 * @param {object} obj - Object for checking
 * @returns {boolean} - Checking result
 */
function isFunction(obj) {
    return (obj &&
        typeof obj == 'function');
}


/**
 * Check isset variable
 *
 * @param {*} param - Param for checking
 * @returns {*} - If param isset, return this, else return empty string
 */
function isset(param) {
    return (
        param &&
        (typeof param != 'undefined') &&
        param !== '' &&
        param !== 0
    ) ? param : '';
}


/**
 * Tag script to body or remove him
 *
 * Methods:
 *  add - Added script tag to page
 *      @param {string} id  - ID for script tag
 *      @param {string} src - Source for script tag
 *
 *  set - Removed script tag from page
 *      @param {string} id  - ID for script tag
 */
var Script = {
    add: function(id, src) {
        if ( ! isset(id) ||
            ! isset(src)) {
            return;
        }

        library_data.empty.script.id = id;
        library_data.empty.script.setAttribute('src', src);
        body.appendChild(library_data.empty.script);
    }
    , remove: function(id) {
        Selector.id(id).remove();
    }
}

/**
 * AJAX function
 *
 * @param {string} url    - Request URL
 * @param {string} method - Request type ('post'/'get')
 * @param {object} params - Object with params (
 *        for files {
 *            name: 'vasya' - Sended to $_POST[]
 *            , files: {
 *                custom_filename: element.files[0] - Sended to $_FILES[]
 *            }
 *        })
 * @param {func} func_waiting  - Function while waiting
 * @param {func} func_callback - Function on success
 * @param {func} func_error    - Function on error
 * @param {func} func_progress - (optional) Function on uploading progress
 */
function AJAX(url, method, params, func_waiting, func_callback, func_error, func_progress) {
    var xhr = null;

    try { // For: chrome, firefox, safari, opera, yandex, ...
        xhr = new XMLHttpRequest();
    } catch(e) {
        try { // For: IE6+
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        } catch(e1) { // if JS not supported or disabled
            console.log('Browser Not supported!');
            return;
        }
    }

    xhr.onreadystatechange = function() {

        // ready states:
        // 0: uninitialized
        // 1: loading
        // 2: loaded
        // 3: interactive
        // 4: complete

        if (xhr.readyState == 4) { // when result is ready

            library_data.xhr = null;

            var response_text = xhr.responseText;

            try {
                response_text = JSON.parse(response_text);
            } catch (e) { }

            if (xhr.status === 200) { // on success
                if (isFunction(func_callback)) {
                    func_callback(response_text);
                }
            } else { // on error
                if (isFunction(func_error)) {
                    func_error(response_text, xhr);
                    console.log(xhr.status + ': ' + xhr.statusText);
                }
            }
        } else { // waiting for result
            if (isFunction(func_waiting)) {
                func_waiting();
            }
        }
    };

    var data = null;

    if (params.files) {
        method = 'POST';

        data = new FormData();
        for (var index_param in params) {
            if (typeof params[index_param] == 'object') {
                for (var index_file in params[index_param]) {
                    data.append(index_file, params[index_param][index_file]);
                }
            } else {
                data.append(index_param, params[index_param]);
            }
        }

        if (isFunction(func_progress)) {
            xhr.upload.onprogress = function(event) {
                // 'progress: ' + event.loaded + ' / ' + event.total;
                func_progress(event);
            }
        }
    } else {
        data = params.serialize();
    }

    method = method.toUpperCase();

    if (method == 'GET' && data) {
        url += '?' + data;
    }

    xhr.open(method, url, true);

    if ( ! params.files) {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send(data);

    library_data.xhr = xhr;
}

//    function example_AJAX_data() {
//        var req_param = {
//            foo: 'vasya'
//            , bar: 'petya'
//        }
//
//        AJAX('http://ipinfo.io/127.0.0.1/json', 'POST', req_param, function() {console.log('wait');}, function(data) {console.log(data);});
//    }
//
//    function example_AJAX_file(element) {
//        var req_param = {
//            name: 'vasya'
//            , files: {
//                uploadlogo: element.files[0]
//            }
//        }
//
//        AJAX('http://ipinfo.io/127.0.0.1/json', 'POST', req_param, function() {console.log('wait');}, function(data) {console.log(data);});
//    }

/**
 * Object for URL hash
 *
 * Methods:
 *  get - Converting hash-string to object with params
 *      @returns {object}
 *
 *  set - Converting object with params to hash-string and set him
 *
 *  @param {object} delimiters - (optional) Object with params (
 *        {
 *            values: 'string'  - (optional) Delimiter for values
 *            , pairs: 'string' - (optional) Delimiter for pairs 'key' -> 'value'
 *        })
 *
 *  @param {object} params - Object with params (
 *        {
 *            key: value
 *            , key: value
 *        })
 */
var Hash = {
    values_delimiter: '='
    , pairs_delimiter: '&'
    , empty_default: ''
    , get: function(delimiters) {
        delimiters = delimiters || {};
        var obj_hash = {};

        var arr_hash = window.location.hash.slice(1)
            .replace(/(<|>|\"|\'|\/|%3C|%3E|%22|%27)/g, '')
            .split(delimiters.pairs || this.pairs_delimiter);

        for (var index_hash in arr_hash) {
            var temp_hash = arr_hash[index_hash].split(delimiters.values || this.values_delimiter);
            obj_hash[decodeURIComponent(temp_hash[0])] = decodeURIComponent(temp_hash[1]);
        }

        return obj_hash;
    }
    , set: function(params, delimiters) {
        delimiters = delimiters || {};
        var self = this;

        var hash = Object.keys(params)
            .map(function(key) {
                return [
                    encodeURIComponent(key)
                    , encodeURIComponent(params[key])
                ].join(delimiters.values || self.values_delimiter);
            }).join(delimiters.pairs || this.pairs_delimiter);

        window.location.hash = (hash ? ('#' + hash) : this.empty_default);
    }
}


/**
 * Custom Masonry plugin for tails
 *
 * Examples:
 * 	dom ready / window.onload 	 - MasonryTails.Run('.wrappers', true);
 * 	window.onresize 			 - MasonryTails.Refresh();
 * 	after changes children count - MasonryTails.Refresh(true);
 */
var MasonryTails = {
    _remember_position: false
    , _elements_in_columns: []
    , _elements_added: false
    , _wrapper_selector: ''
    , _parents: []
    , _elements: []
    , _columns_count: []
    , _columns: []

    /**
     * Run handmade Masonry plugin
     *
     * @param {string}  wrapper_selector  - Parents element selector
     * @param {boolean} remember_position - (optional) Remember children positions in parent columns
     */
    , Run: function(wrapper_selector, remember_position) {
        this._remember_position = remember_position || this._remember_position;
        this._wrapper_selector = wrapper_selector || this._wrapper_selector;

        if ( ! this._wrapper_selector &&
            ! this._elements_added) {
            return;
        }

        var parents = document.querySelectorAll(this._wrapper_selector);

        for (var index_parent = 0; index_parent < parents.length; index_parent++) {

            var childrens = parents[index_parent].childNodes;

            if (childrens.length) {

                this._parents.push(parents[index_parent]);

                parents[index_parent].style.position = 'relative';

                this._elements.push([]);

                for (var index_child = 0; index_child < childrens.length; index_child++) {

                    childrens[index_child].style.position = 'absolute';
                    this._elements[(this._elements.length - 1)].push(childrens[index_child]);
                }
            }
        }

        if ( ! this._parents.length ||
            ! this._elements.length) {
            return;
        }

        this.Refresh();
    }

    /**
     * Refresh tails position
     *
     * @param {boolean} elements_added - (optional) Refresh array with children elements
     */
    , Refresh: function(elements_added) {

        if ( ! this._wrapper_selector ||
            ! this._parents.length ||
            ! this._elements.length) {
            return;
        }

        if (elements_added) {
            this._elements_added = elements_added;
            this.Run();
            return;
        }

        var new_columns_count = null;
        var width_element = null;

        for (var index_parent in this._parents) {

            width_element = this._elements[index_parent][0].clientWidth;

            if ( ! width_element) {
                continue;
            }

            new_columns_count = Math.round(this._parents[index_parent].clientWidth / width_element);

            this._columns[index_parent] = [];

            for (var i = 0; i < new_columns_count; i++) {
                this._columns[index_parent].push(0);
            }

            if ( ! this._remember_position ||
                ! this._elements_in_columns[index_parent] ||
                (this._columns_count[index_parent] - new_columns_count) ||
                this._elements_added) {

                this._columns_count[index_parent] = new_columns_count;
                this._elements_added = false;

                if (this._remember_position) {
                    this._elements_in_columns[index_parent] = {};
                }

                for (var index in this._elements[index_parent]) {
                    if (typeof this._elements[index_parent][index] != 'object') {
                        continue;
                    }

                    var index_min = this._columns[index_parent].indexOf(Math.min.apply(null, this._columns[index_parent]));

                    if (this._remember_position) {
                        this._elements_in_columns[index_parent][index] = index_min;
                    }

                    this._elements[index_parent][index].style.top = this._columns[index_parent][index_min] + 'px';
                    this._elements[index_parent][index].style.left = index_min * width_element + 'px';

                    this._columns[index_parent][index_min] += this._elements[index_parent][index].clientHeight;
                }
            } else {

                for (var index_element in this._elements_in_columns[index_parent]) {

                    var index_column = this._elements_in_columns[index_parent][index_element];

                    this._elements[index_parent][index_element].style.top = this._columns[index_parent][index_column] + 'px';
                    this._elements[index_parent][index_element].style.left = index_column * width_element + 'px';

                    this._columns[index_parent][index_column] += this._elements[index_parent][index_element].clientHeight;
                }
            }

            this._parents[index_parent].style.height = this._columns[index_parent][this._columns[index_parent].indexOf(Math.max.apply(null, this._columns[index_parent]))] + 'px';
        }
    }
};

/**
 * Return current operation system name
 */
function getOs(){

    // mobile version
    //var isMobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(navigator.userAgent);

    // system
    var os = '';

    var clientStrings = [
        {s:'Windows 3.11', r:/Win16/},
        {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
        {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
        {s:'Windows 98', r:/(Windows 98|Win98)/},
        {s:'Windows CE', r:/Windows CE/},
        {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
        {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
        {s:'Windows Server 2003', r:/Windows NT 5.2/},
        {s:'Windows Vista', r:/Windows NT 6.0/},
        {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
        {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
        {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
        {s:'Windows 10', r:/(Windows 10|Windows NT 10.0)/},
        {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
        {s:'Windows ME', r:/Windows ME/},
        {s:'Kindle', r:/Kindle|Silk|KFTT|KFOT|KFJWA|KFJWI|KFSOWI|KFTHWA|KFTHWI|KFAPWA|KFAPWI/},//more priority than android
        {s:'Android', r:/Android/},
        {s:'Open BSD', r:/OpenBSD/},
        {s:'Sun OS', r:/SunOS/},
        {s:'Linux', r:/(Linux|X11)/},
        {s:'iOS', r:/(iPhone|iPad|iPod)/},
        {s:'Mac OS X', r:/Mac OS X/},
        {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
        {s:'QNX', r:/QNX/},
        {s:'UNIX', r:/UNIX/},
        {s:'BeOS', r:/BeOS/},
        {s:'OS/2', r:/OS\/2/},
        {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
    ];

    for (var index in clientStrings) {
        if (clientStrings[index].r.test(navigator.userAgent)) {
            os = clientStrings[index].s;
            break;
        }
    }

    if (os.indexOf('Mac OS') != -1){
        os = 'macosx';
    } else if (os.indexOf('Android') != -1){
        os = 'android';
    } else if (os.indexOf('Kindle') != -1){
        os = 'kindle';
    } else if (os == 'iOS'){
        if (navigator.userAgent.indexOf('iPad') != -1){
            os = 'ipad';
        } else {
            os = 'iphone';
        }
    } else {
        os = 'windows';
    }
    return os;
}