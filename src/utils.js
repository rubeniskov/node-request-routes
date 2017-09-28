import debug from 'debug';
import util from 'util';
import url from 'url';

const utils = {
    ...util,
    debug: (name) => {
        return debug(utils.format('%s.%s', 'request-routes', name));
    },
    extend: (...args) => {
        return Object.assign(...args);
    },
    filterForNonReserved: (reserved, options) => {
        // Filter out properties that are not reserved.
        // Reserved values are passed in at call site.

        var object = {}
        for (var i in options) {
            var notReserved = (reserved.indexOf(i) === -1)
            if (notReserved) {
                object[i] = options[i]
            }
        }
        return object
    },
    filterOutReservedFunctions: (reserved, options) => {
        // Filter out properties that are functions and are reserved.
        // Reserved values are passed in at call site.

        var object = {}
        for (var i in options) {
            var isReserved = !(reserved.indexOf(i) === -1)
            var isFunction = (typeof options[i] === 'function')
            if (!(isReserved && isFunction)) {
                object[i] = options[i]
            }
        }
        return object
    },
    parseRequestOptions: (options) => {
        const {host, path, ...others} = {...options};

        return {
            url: url.parse(url.format({...url.parse(host||''), pathname: path})),
            ...others
        };
    },
}

export default utils;
