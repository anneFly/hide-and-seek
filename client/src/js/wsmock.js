(function () {
    var noop = function () {};

    var genUniqueId = (function () {
        var nextId = 0;
        return function () {
            nextId += 1;
            return nextId;
        };
    }());


    var server = (function () {
        var WebSockServer = function () {
            this.connections = [];
        };
        WebSockServer.prototype.broadcast = function (sender, message) {
            var i, cws;
            for (i=0; i<this.connections.length; i++) {
                cws = this.connections[i];
                if (cws.cid !== sender.cid) {
                    cws.onmessage(message);
                }
            }
        };

        return (new WebSockServer());
    }());


    var WebSocketMock = function () {
        this.cid = genUniqueId();
    };
    WebSocketMock.prototype.onopen = noop;
    WebSocketMock.prototype.onerror = noop;
    WebSocketMock.prototype.onmessage = noop;
    WebSocketMock.prototype.send = function (msg) {
        server.broadcast(this, msg);
    };


    // mock the shit
    window.WebSocket = WebSocketMock;

}());
