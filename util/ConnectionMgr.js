let Stomp = require('../lib/stomp-client');

let connMgr = {
    // ipaddress:
    // port:
    // username:
    // password:
    connHandlers:{},
    connections: {},
    sendTopic:function(ipAddress, port, username, password, destination, content){
        let _conns = this.connHandlers;
        let ipString = ipAddress.replace(/\./g,'');
        let dest = destination.replace(/\./g,'');
        let key = "topic"+ ipString + port + dest;
        let destString = '/topic/'+destination;
        let conn = this.connections[key];

        if(typeof conn !== 'undefined'){
            conn.publish(destination, content);

        }else{
            let handlers = [];
            let client = new Stomp(ipAddress, port, username, password);
            client.connect(function(sessionId) {
                client.subscribe(destString, function(body, headers) {
                    console.log('Recieved from '+destination+':', body);
                    handlers.forEach(handlerObj => {
                        handlerObj.handle(body);
                        handlerObj.lastupdate = new Date().getTime();
                    });
                });
            });
            client.publish(destination, content);
            this.connections[key] = client;
            _conns[key] = handlers;
        }
        
    },
    sendQueue:function(ipAddress, port, username, password, destination, content){
        let _conns = this.connHandlers;
        let ipString = ipAddress.replace(/\./g,'');
        let dest = destination.replace(/\./g,'');
        let key = "queue"+ ipString + port + dest;
        let destString = '/queue/'+destination;
        let conn = this.connections[key];

        if(typeof conn !== 'undefined'){

            conn.publish(destination, content);

        }else{
            let handlers = [];
            let client = new Stomp(ipAddress, port, username, password);
            client.connect(function(sessionId) {
                client.subscribe(destString, function(body, headers) {
                    console.log('Recieved from '+destination+':', body);
                    handlers.forEach(handlerObj => {
                        handlerObj.handle(body);
                        handlerObj.lastupdate = new Date().getTime();
                    });
                });
            });
            client.publish(destination, content);
            this.connections[key] = client;
            _conns[key] = handlers;
        }
    },
    createTopic : function(ipAddress, port, username, password, destination, newHandler){
        let _conns = this.connHandlers;
        let ipString = ipAddress.replace(/\./g,'');
        let dest = destination.replace(/\./g,'');
        let key = "topic"+ ipString + port + dest;
        let handlers = _conns[key];
        
        let destString = '/topic/'+destination;
        if(typeof handlers === 'undefined') {
            console.log("creating new client connection")
            handlers = [
                {
                    handle: newHandler,
                    lastupdate: new Date().getTime()
                }
            ];
            _conns[key] = handlers;

            let client = new Stomp(ipAddress, port, username, password);
            client.connect(function(sessionId) {
                client.subscribe(destString, function(body, headers) {
                    console.log('Recieved from '+destination+':', body);
                    handlers.forEach(handlerObj => {
                        handlerObj.handle(body);
                        handlerObj.lastupdate = new Date().getTime();
                    });
                });
            });
            this.connections[key] = client;

        }else if(Array.isArray(handlers) && handlers.length == 0){

            console.log("updating handler list")
            handlers.push({
                handle: newHandler,
                lastupdate: new Date().getTime()
            })
            _conns[key] = handlers;
        }
        
        
    },
    createQueue : function(ipAddress, port, username, password, destination, newHandler){
        let _conns = this.connHandlers;
        let ipString = ipAddress.replace(/\./g,'');
        let dest = destination.replace(/\./g,'');
        let key = "queue"+ ipString + port + dest;
        console.log(key)
        let handlers = _conns[key];
        
        let destString = '/queue/'+destination;
        if(typeof handlers === 'undefined') {
            handlers = [{
                handle: newHandler,
                lastupdate: new Date().getTime()
            }];
            _conns[key] = handlers;

            let client = new Stomp(ipAddress, port, username, password);
            client.connect(function(sessionId) {
                client.subscribe(destString, function(body, headers) {
                    console.log('Recieved from '+destination+':', body);
                    handlers.forEach(handlerObj => {
                        handlerObj.handle(body);
                        handlerObj.lastupdate = new Date().getTime();
                    });
                });
            });
            this.connections[key] = client;

        }else if(Array.isArray(handlers) && handlers.length == 0){
            handlers.push({
                handle: newHandler,
                lastupdate: new Date().getTime()
            })
            _conns[key] = handlers;
        }
    }
}

module.exports = connMgr;