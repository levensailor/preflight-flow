//*---webhook.js is the listener for the Elderlyft
//*---Created by Jeff Levensailor jeff@levensailor.com

//Webhook software Declarations
var bodyParser = Meteor.npmRequire('body-parser');
Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({extended: false}));

//Route to Webhook
Picker.route('/webhook', function(params, request, response) {
  const patientNumber = request.body.number;
  var date = new Date();
  var patient = Customer.findOne({number: patientNumber}).name;
  const message = "Help is on the way, "+patient+"!";

  //Check if Customer is defined (number is found)
  if (typeof patient !== "undefined"){
    var doc = {
        "patient" : patient,
        "provider" : "Jeff Levensailor",
        "date" : date
    }
    Meteor.call(
      'addRideData',
      doc,
      function(err,res){
        if(err){
          console.log(err);
        }
        else{
          Meteor.call(
            'tropoSms',
            patientNumber,
            message,
            function(err,res){
              if(err){console.log(err);
              }
              else{}
            }
          )

        }
      }
    )//addRideData
  }
    //First time setup, tells patient to call provider scheduler IVR
    else{
      var errorMsg = "Sorry, please call our offices at +15619078669";
      Meteor.call(
        'tropoSms',
        patientNumber,
        errorMsg,
        function(err,res){
          if(err){console.log(err);
          }
          else{}
        }
      )
    }
});//picker
