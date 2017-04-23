//*---A Spark integration using Meteor.JS
//*---Created by Jeff Levensailor jeff@levensailor.com

//*---Change sparkToken to your unique API key
const sparkToken = 'Zjc3NjA3NzMtZDQ5ZS00MjllLWFjZTItOWM0N2M5YjkxYzY5ZDdmZWZhOWItMGU1';
const sparkAPI = 'https://api.ciscospark.com/v1/';
var toPersonId;
var message;

Meteor.methods({
  attachSparkRoom: function(testId) {
    //Boards and Users should have all the info we need
    var projectCode = TestPlans.findOne({_id: testId}).project;
    var companyName = TestPlans.findOne({_id: testId}).companyName;
    var engineerEmail = TestPlans.findOne({_id: testId}).engineerEmail;
    var customerEmail = TestPlans.findOne({_id: testId}).customerEmail;
    var projectManagerEmail = TestPlans.findOne({_id: testId}).projectManagerEmail;
    var testSections = TestPlans.findOne({_id: testId}).sections;
    var title = (companyName+": "+projectCode+" Testing");
    var welcomeText = ("Welcome to the Testing and Validation Spark Room");
    var request = Meteor.npmRequire('request');
    var req = {
    auth: { bearer: sparkToken },
    url: sparkAPI + 'rooms',
    json: true,
    body: { 'title': title }
    };

    request.post(req, Meteor.bindEnvironment(function(err, res) {
    if(err) {
    console.log(err.message);
    } else {
      var callBack = res.body.id;
      TestPlans.update({_id: testId}, {$set: {sparkId: callBack}});
      Meteor.call(
         'msgSparkRoom',
          callBack,
          welcomeText,
           function(err, res) {
             if(err) {
               console.log(err);
             } else {
               Meteor.call(
                 'addSparkUser',
                  callBack,
                   engineerEmail,
                   function(err, res) {
                      if(err) {
                        console.log(err);
                      } else {
                        Meteor.call(
                          'addSparkUser',
                           callBack,
                            projectManagerEmail,
                            function(err, res) {
                               if(err) {
                                 console.log(err);
                               } else {
                                 Meteor.call(
                                    'addSparkUser',
                                     callBack,
                                     customerEmail,
                                      function(err, res) {
                                        if(err) {
                                          console.log(err);
                                        } else {
                                        }//else
                                       }
                                     );//call to addUser
                               }//else
                              }
                            );//call to addUser
                      }//else
                     }
                   );//call to addUser
                  }
                }
              );//call to msgRoom

      }//else
    }));//original rest call
  },//spark.attachRoom
  msgSparkRoom: function(roomId, message) {
    var request = Meteor.npmRequire('request');
    var req = {
    auth: { bearer: sparkToken },
    url: sparkAPI + 'messages',
    json: true,
    body: {
      'roomId': roomId,
      'text': message
     }
    };//end setup

    request.post(req, function(err, res) {
    if(err) {
    console.log("THERE WAS AN ERROR: "+err);
    } else {
      }
    });//rest call
  },//spark.msgRoom
  addSparkUser: function(roomId, personEmail) {
    var request = Meteor.npmRequire('request');
    var req = {
    auth: { bearer: sparkToken },
    url: sparkAPI + 'memberships',
    json: true,
    body: {
      'roomId': roomId,
      'personEmail': personEmail
     }
    };//end setup

    request.post(req, function(err, res) {
    if(err) {
    console.log(err);
    } else {
      }
    });//rest call
  },//spark.addUser
  getSparkAvatar: function(personEmail, personId) {
    var fullname = Meteor.users.findOne({_id: personId}).profile.name;
    var request = Meteor.npmRequire('request');
    var req = {
    auth: { bearer: sparkToken },
    url: sparkAPI + 'people' + '?email=' +personEmail,
    json: true,
    };//end setup
    request.get(req, Meteor.bindEnvironment(function(err, res) {
    if(err) {
      console.log("error: "+err);
    } else {
      var avatarUrl = res.body.items[0].avatar;
      if (typeof avatarUrl !== "undefined"){
        Meteor.users.update({_id: personId}, {$set: {'profile.avatarUrl': avatarUrl}});
    //    console.log("SS avatarurl: "+res.body.items[0].avatar);
    //    return res.body.items[0].avatar;
      }//if
      else if (fullname) {
        var initials = fullname.split(/\s+/).reduce((memo, word) => {
          return memo + word[0];
        }, '').toUpperCase();
        Meteor.users.update({_id: personId}, {$set: {'profile.initials': initials}});
      }



    }//bigelse
    }));//rest call
  },//spark.listPeople
})//methods
