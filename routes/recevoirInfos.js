var express = require('express');
var router = express.Router();
var msg = ''
const { EventHubConsumerClient } = require("@azure/event-hubs");
const eventHubsCompatibleEndpoint = "sb://ihsuprodblres019dednamespace.servicebus.windows.net/";
const eventHubsCompatiblePath = "iothub-ehub-porteshub-25051477-3e53429fce";
const iotHubSasKey = "7NHXeGdMxDD9WsZVRG/j8AQ5R8YyZUvTPnB+T+Qx6iQ=";
const connectionString = `Endpoint=${eventHubsCompatibleEndpoint};EntityPath=${eventHubsCompatiblePath};SharedAccessKeyName=service;SharedAccessKey=${iotHubSasKey}`;

var printError = function (err) {
  console.log(err.message);
};

var printMessages = function (messages) {
  for (const message of messages) {
    console.log("Telemetry received: ");
    console.log(JSON.stringify(message.body));
    console.log("Properties (set by device): ");
    console.log(JSON.stringify(message.properties));
    console.log("System properties (set by IoT Hub): ");
    console.log(JSON.stringify(message.systemProperties));
    console.log("");
    msg = message.body
  }
};

async function main() {
  console.log("IoT Hub Quickstarts - Read device to cloud messages.");

    const clientOptions = {
     };

  const consumerClient = new EventHubConsumerClient("$Default", connectionString, clientOptions);

   consumerClient.subscribe({
    processEvents: printMessages,
    processError: printError,
  });
}

main().catch((error) => {
  console.error("Error running sample:", error);
});
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json( msg );
});

module.exports = router;
