
var express = require('express');
var router = express.Router();
var request = require('request');

var payload = ''
//var Client = require('azure-iothub').Client;
//var Message = require('azure-iot-common').Message;

//var connectionString = "HostName=portesHub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=nm9VzhUwhP9nMK4vVn4RpscYSAg8YqGnq7MR4iy8UTc=";
//var targetDevice = 'collect_temp';
//var serviceClient = Client.fromConnectionString(connectionString);
router.post('/', function (req, res, next) {
 /**  serviceClient.open(function (err) {
    if (err) {
      console.error('Could not connect: ' + err.message);
      res.status(500).send('Could not connect to IoT Hub');
    } else {
      console.log('Service client connected');
      var telemetryData;
      console.log(req.body)
      if (req.body.controle === 'Automatique') {
        telemetryData = { controle: 'Automatique' };
      } else if (req.body.action === 'Ouvrir' || req.body.action === 'Fermer') {
        const pourcentage = parseInt(req.body.pourcentage);
        telemetryData = { controle: 'Manuelle', action: req.body.action, pourcentage: pourcentage };
      } else {
        res.status(400).send('Invalid action');
        return;
      }
      const message = new Message(JSON.stringify(telemetryData));
      message.ack = 'full';
      message.messageId = "My Message ID";
      console.log('Sending message: ' + message.getData());
      serviceClient.send(targetDevice, message);
      res.send('Message sent successfully');

    }
  });*/
  if (req.body.controle === 'Automatique') {
    payload = `"payload": {
      "controle":'Automatique'}`

  } else if (req.body.action === 'Ouvrir' || req.body.action === 'Fermer') {
    const pourcentage = parseInt(req.body.pourcentage);
    payload = `"payload": {
      "controle":'Manuelle',
      "action":"${req.body.action}",
      "pourcentage": "${pourcentage}"
    }`
  }
  var dataString = `{
    "methodName": "SetControle",
    "responseTimeoutInSeconds": 200,
    ${payload}
  }`;
  
  var options = {
    url: 'https://portesHub.azure-devices.net/twins/collect_temp/methods?api-version=2021-04-12',
    method: 'POST',
    headers: headers,
    body: dataString
  };
request(options, callback);
res.send('')
});

var headers = {
  'Authorization': 'SharedAccessSignature sr=portesHub.azure-devices.net&sig=1fDptxFxc5MxWNl4qk8ADtj%2FRymObLodx30Ndz%2BQ%2Boo%3D&se=10000001685237832&skn=iothubowner',
  'Content-Type': 'application/json'
};



function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
      console.log(body);
  }
}
module.exports = router;
