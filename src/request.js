import {Request as RequestBase} from 'request';
// import isstream from 'request/node_modules/isstream'
import JSONStream from 'JSONStream';
import through from 'through2';
import utils from './utils';
//
// const debug = utils.debug('request');

export default class Request extends RequestBase {
    constructor(options) {
        options = {
            interrupt: options === false || options && options.interrupt,
            ...options}
        super(options);

        if(options.promise) {
            this.promise();
        }
    }

    init(options) {
      options = {...options};
      const reserved = [...Object.keys(RequestBase.prototype), 'promise', 'then', 'catch', 'parse', 'transform'],
            nonReserved = utils.filterForNonReserved(reserved, options);

        utils.extend(this, nonReserved);
        options = utils.filterOutReservedFunctions(reserved, options);

        if(options.interrupt) {
            return this;
        }

        if (options.method) {
            this.explicitMethod = true
        }

        super.init(options);
        return this;
    }

    request = (options) => {
        return this.init({...options, interrupt: false});
    }

    promise() {
        if (!this._promise) {
            if(this.response) {
                return Promise.reject(new Error('Response already receiving can\'t transform to a promise'));
            } else {
                Object.defineProperty(this, '_promise', {
                    enumerable: false,
                    configurable: false,
                    get: () => {
                        return new Promise((resolve, reject) => {
                            this.on('response', (res) => {
                                this.readResponseBody(res);
                            });
                            this.on('complete', (res) => {
                                resolve(res);
                            });
                            this.on('error', (err) => {
                                reject(err);
                            });
                        })
                    }
                });
            }
        }
        return this._promise;
    }

    then(onFulfilled, onRejected) {
        return this.promise().then(onFulfilled, onRejected);
    }

    catch (onRejected) {
        return this.promise().catch(onRejected);
    }

    parse(...args) {
        return this.pipe(JSONStream.parse(...args));
    }

    transform(stream) {
        return this.pipe(through(stream));
    }
}
