define(["require", "exports"], function(require, exports) {
    var ServerRequestType;
    (function (ServerRequestType) {
        ServerRequestType[ServerRequestType["get"] = 0] = "get";
        ServerRequestType[ServerRequestType["post"] = 1] = "post";
    })(ServerRequestType || (ServerRequestType = {}));

    
    return ServerRequestType;
});
