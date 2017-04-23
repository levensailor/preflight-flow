//For Transactions between Customer and Provider

templates = "Templates";  // avoid typos, this string occurs many times.
Templates = new Mongo.Collection(templates);

Templates.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});

Meteor.methods({
  /**
   * Invoked by autoform to add a new Ride Data record.
   * @param doc The Templates document.
   */
  addTemplate: function(doc) {
    console.log("Adding", doc);
    check(doc, Templates.simpleSchema());
    Templates.insert(doc, function(err, docID) {
      if (typeof docID !== "undefined"){
      var patient = Templates.findOne({_id: docID}).patient;
      var providerName = Templates.findOne({_id: docID}).provider;
      var providerSpark = Templates.findOne({name: providerName}).sparkid;
      var patientName = Templates.findOne({_id: docID}).patient;
      var patientAdd = Customer.findOne({name: patientName}).address;
      var patientCity = Customer.findOne({name: patientName}).city;
      var patientSt = Customer.findOne({name: patientName}).state;
      var patientZip = Customer.findOne({name: patientName}).zip;
      var date = Templates.findOne({_id: docID}).date;
      var message = "Special Needs person requires a lift!: \n"+patient+"\n"+date+"\n"+patientAdd+"\n"+patientCity+" "+patientSt+"\n"+patientZip;
      var googleApiKey = "AIzaSyCki3ZyudDc--brJmAbjP_zV7TtUj8iPrs";
      var googleApi = "https://maps.googleapis.com/maps/api/staticmap?center=";
      var addPlus = patientAdd.split(' ').join('+');
      console.log("thisplus: "+addPlus);
      var file = googleApi+addPlus+"+"+patientZip+"&zoom=14&size=400x400&key="+googleApiKey;
      Meteor.call(
      'sparkMsg',
      providerSpark,
      message,
        function(err, res) {
          if(err) {
            console.log(err);
          } else {
            }
       }
     )//sparkMsg
      Meteor.call(
      'sparkMsgMap',
      providerSpark,
      file,
      function(err, res) {
        if(err) {
          console.log(err);
        } else {
         }
       }
     )//sparkMsgMap


    }
    else {console.log("dang, didn't work")}
    });
    },//addRideData
  /**
   *
   * Invoked by autoform to update a Ride Data record.
   * @param doc The Templates document.
   * @param docID It's ID.
   */
  updateTemplate: function(doc, docID) {
    console.log("Updating", doc);
    check(doc, Templates.simpleSchema());
    Templates.update({_id: docID}, doc);
  },
  remove: function(docID) {
    Templates.remove({_id: docID});
  }


});

// Publish the entire Collection.  Subscription performed in the router.
if (Meteor.isServer) {
  Meteor.publish('Templates', function () {
    return Templates.find();
  });
}

Meteor.isClient && Template.registerHelper("Templates", Templates);

 Templates.attachSchema(new SimpleSchema({
   technology: {
     label: "Technology",
     type: String,
     optional: true,
     autoform: {

     }
   },
   section: {
     label: "Section",
     type: String,
     optional: true,
     autoform: {

     }
   },
   product: {
     label: "Product",
     type: String,
     optional: true,
     autoform: {

     }
   },
   description: {
     label: "Description",
     type: String,
     optional: true,
     autoform: {

     }
   },
   instructions: {
     label: "Instructions",
     type: String,
     optional: true,
     autoform: {

     }
   },
   expected: {
     label: "Expected Results",
     type: String,
     optional: true,
     autoform: {

     }
   }
}));
