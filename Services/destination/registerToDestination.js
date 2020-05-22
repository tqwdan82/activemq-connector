let connMgr = require('../../util/ConnectionMgr');
const validate = function(inputs){
    if(typeof inputs.ipAddress === 'undefined'){
        throw "Invalid IP address"
    }

    if(inputs.ipAddress.trim() === ''){
        throw "Invalid IP address"
    }

    if(typeof inputs.port === 'undefined'){
        throw "Invalid port"
    }

    if( !(inputs.type === 'topic'
        || inputs.type === 'queue') ){
        throw "Invalid destination type"
    }

    if(typeof inputs.destination === 'undefined'){
        throw "Invalid destination"
    }

    if(inputs.destination.trim() === ''){
        throw "Invalid destination"
    }

    if(isNaN(inputs.port)){
        throw "Invalid port"
    }
    if (inputs.handler.constructor !== Function) {
        throw "Invalid handler"
    }

};

const operation = {
    loadOperation: function(serviceManager, inputs, callback, mcHeader){

        let returnData = {};
        try{
            validate(inputs);
            if(inputs.type === 'topic'){
                connMgr.createTopic(inputs.ipAddress, inputs.port, inputs.username, inputs.password, inputs.destination, inputs.handler);
            }else if(inputs.type === 'queue'){
                connMgr.createQueue(inputs.ipAddress, inputs.port, inputs.username, inputs.password, inputs.destination, inputs.handler);
            }

            returnData["status"] = "Ok";
            returnData["details"] = "Register to destination completed.";
            returnData["data"] = inputs;
            callback(returnData);
            
        }catch(err){
            
            returnData["status"] = "Failed";
            returnData["details"] = "Register to destination failed. Error: " + err;
            returnData["data"] = inputs;
            callback(returnData);
        }

    }
};

module.exports = operation;