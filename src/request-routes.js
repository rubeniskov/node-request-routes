import Request from './request';
import Router from './router';
import utils from './utils';

export class RequestRoutes extends Router {
    constructor(options){
        super(options);
        this.options = {...options};
    }

    parseRequestOptions(options){
        return utils.parseRequestOptions({...this.options, ...(typeof options === 'string' ? {path: options } : options)})
    }

    request(options, callback){
        const request = new Request(false);
        this.handle(options = this.parseRequestOptions(options), request, (err) => {
            if(err){
                throw err;
            }
            request.request(options, callback);
        });
        return request;
    }
}

export default (options) => {
    return new RequestRoutes(options);
}

export {Request, Router};
