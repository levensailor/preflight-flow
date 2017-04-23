//*---Created by Jeff Levensailor jeff@levensailor.com

//*---Change tropoToken to your unique API key
const tropoToken = '7648727465567271425876777a50666f617443514d5a4b6c684c507673755675724e465a70584b6458655a52 ';
const url = 'https://api.tropo.com/1.0/sessions';

Meteor.methods({
  tropoTest: function(number) {
    check(number, String);
    check(message, String);
    var request = Npm.require('request');
    var options = { method: 'POST',
      url: url,
      headers:
       { 'cache-control': 'no-cache',
         'content-type': 'application/json' },
      body:
       { token: tropoToken,
         numberToDial: number
         },
      json: true };//options

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
    });//request
  },//tropoSms

})//methods
