module.exports = function(request){
    return Object.assign(request.default, request);
}(require('./lib/request-routes'));
