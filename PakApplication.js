const pakDetails = {
    "AI_Enabled": false,
    "VI_Enabled": false,
    "WI_Enabled": false,
    "DBI_Enabled": false,
    "pakCode":"MCP_AMQC_0_0_1",
    "Name":"Manti-core ActiveMQ Plugin Package",
    "Description": "This is a plugin is meant for the interface with ActiveMQ.",
    "WebContext": "activeMQConnector",
    "AppName": "activeMQConnector"
}
const fs = require('fs')
const path = require('path')

const init = function(dbMgr, svcMgr, webMgr, appMessenger){

    //look at all the services and operations
    let svcsPath =  path.join(__dirname, 'Services');
    if (fs.existsSync(svcsPath)) //if the services directory exists
    {
        //get all contexts
        let services = fs.readdirSync(svcsPath);
        //iterate all services
        services.forEach(function(service) {

            let svcDirPath = path.join(svcsPath, service)
            //read and iterate the service for all the operations
            let operations = fs.readdirSync(svcDirPath);
            //iterate all operations to slice the extention
            let returnOperations = [];
            operations.forEach(function(operation) {
                // console.log(svcDirPath, operation);
                var opName = operation.substring(0, operation.indexOf(".js"));
                returnOperations.push(opName);
            });

            //register the service and operations
            svcMgr.ServiceManager.registerPackageService(
                svcsPath,
                pakDetails.AppName,
                service,
                returnOperations
            );

        });
    }

}

const undeploy = function(dbMgr, svcMgr, webMgr, appMessenger){
};

const PakManager = {
    init:init,
    undeploy: undeploy,
    pakDetails:pakDetails
};

module.exports = PakManager;