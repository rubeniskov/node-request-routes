import RouterBase  from 'router';
import Layer from 'router/lib/layer';
import utils from './utils';

const debug = utils.debug('router');

export const defaults = {
    path: '/',
    offset: 0
}

export default class Router extends RouterBase {
    constructor(options) {
        let self = super(options);
    }

    use(offset = defaults.offset, path = defaults.path, ...callbacks) {

        if(typeof(offset) !== 'number'){
            callbacks = [path].concat(...callbacks);
            path = offset;
            offset = defaults.offset;
        }

        if (typeof(path) !== 'string') {
            callbacks = [path].concat(...callbacks);
            path = defaults.path;
        }

        if (callbacks.length === 0) {
            throw new TypeError('argument handler is required')
        }

        for (let fn of callbacks) {
            if (typeof fn !== 'function') {
              throw new TypeError('argument handler must be a function')
            }

            debug('use %s %s', path, fn.name || '<anonymous>');

            let layer = new Layer(path, {
                sensitive: this.caseSensitive,
                strict: false,
                end: false
            }, fn);

            layer.route = undefined;
            this.stack.splice(offset, 0, layer);
        }

        return this
    }
}
