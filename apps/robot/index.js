'use strict';

module.change_code = 1;

var alexa = require("alexa-app");
var gcm = require("node-gcm");
var app = new alexa.app("robot");

const gcmServerKey = process.env.GCM_SERVER_KEY;
const registrationToken = process.env.REGISTRATION_TOKEN;

var sender = new gcm.Sender(gcmServerKey);
var registrationTokens = [registrationToken];

var n = ["north", "forward", "up"];
var ne = ["north east"];
var e = ["east", "right"];
var se = ["south east"];
var s = ["south", "back", "backward", "reverse", "down"];
var sw = ["south west"];
var w = ["west", "left"];
var nw = ["north west"];

var net = require('net');
var HOST = 'espritech.ddns.net';
var PORT = 8085;
var client = new net.Socket();

// index is a code
var directionsCodes = [n, ne, e, se, s, sw, w, nw];
var directions = [].concat.apply([], directionsCodes);

function directionToCode(direction) {
  for (var i = 0; i < directionsCodes.length; i++) {
    for (var j = 0; j < directionsCodes[i].length; j++) {
      if (directionsCodes[i][j] == direction) {
        return i;
      }
    }
  }
  return -1;
}

var lightsCode = 9;

app.dictionary = {
  "directions": directions
};

app.launch(function(request, response) {
  response.shouldEndSession(false);
  console.log("Session started");
  response.say("Welcome to marks control service");
});

app.sessionEnded(function(request, response) {
  console.log("Session ended");
});


app.intent("RobotLightsIntent", {
       "slots" : {
         "LEDCOLORS" : "LCOLOR"
       },
    "utterances": [
   // "{toggle|switch|} lights"
     "toggle {-|LEDCOLORS}"
    ]
  },
  function(request, response)
           {
            response.shouldEndSession(false);
           client.connect(PORT, HOST, function(){
             client.write('A');
             client.close();
           });
          // var message = new gcm.Message({
           //   data: { code: lightsCode }
                                       // });
   // sender.send(message, { registrationTokens: registrationTokens }, function (err, data)
     //    {
    //    if (err) {
      //    console.error(err);
      //    response.say("Sorry, there was an unexpected error. Could not send message to robot.");
                //  } 
       //   else 
         // {
        //  console.log(data);
   var color = request.slot("LEDCOLORS");
    response.say("request received  for L E D" + color);
       //   response.say("Turning red L E D light on");
           //}
            //response.send();
      // });
  //  return false;
  }
);

app.intent("RobotStatsIntent", {
    "utterances": [
      "{tell|give|say} {me|} stats",
    ]
  },
  function(request, response) 
           {
            response.shouldEndSession(false);
            if (request.hasSession()) 
               {
                 var session = request.getSession();
                  console.log(session.details.attributes);
                  var stats = "";
                  for (var key in session.details.attributes) 
                    {
                      var counter = session.get(key);
                      stats += ", " + key + " " + counter;
                    }
                 if (stats.length > 0) 
                   {
                    response.say("The stats are " + stats);
                   } 
                 else 
                   {
                     response.say("No moves, yet");
                   }
               }       
               else 
                  {
                   response.say("Sorry, session is not active, no stats are available");
                   }
         }
);

app.intent("RobotStopIntent", {
    "utterances": [
      "{exit|quit|stop|end|bye}",
    ]
  },
  function(request, response) {
    response.say("It was a real pleasure talking to you. Have a good day!");
  }
);

module.exports = app;
