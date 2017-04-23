//For Transactions between Customer and Provider

sections = "Sections";  // avoid typos, this string occurs many times.
Sections = new Mongo.Collection(sections);

Sections.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});

Meteor.methods({
  /**
   * Invoked by autoform to add a new Ride Data record.
   * @param doc The Sections document.
   */
  addSection: function(doc) {
    console.log("Adding", doc);
    check(doc, Sections.simpleSchema());
    Sections.insert(doc, function(err, docID) {
      if (typeof docID !== "undefined"){
      var patient = Sections.findOne({_id: docID}).patient;
      var providerName = Sections.findOne({_id: docID}).provider;
      var providerSpark = Sections.findOne({name: providerName}).sparkid;
      var patientName = Sections.findOne({_id: docID}).patient;
      var patientAdd = Customer.findOne({name: patientName}).address;
      var patientCity = Customer.findOne({name: patientName}).city;
      var patientSt = Customer.findOne({name: patientName}).state;
      var patientZip = Customer.findOne({name: patientName}).zip;
      var date = Sections.findOne({_id: docID}).date;
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
   * @param doc The Sections document.
   * @param docID It's ID.
   */
  updateSection: function(doc, docID) {
    console.log("Updating", doc);
    check(doc, Sections.simpleSchema());
    Sections.update({_id: docID}, doc);
  }
});

// Publish the entire Collection.  Subscription performed in the router.
if (Meteor.isServer) {
  Meteor.publish('Sections', function () {
    return Sections.find();
  });
}


 Sections.attachSchema(new SimpleSchema({
   section: {
     label: "Section",
     type: String,
     optional: true,
   },
   product: {
     label: "Product",
     type: String,
     optional: true,
   },
   technology: {
     label: "Technology",
     type: String,
     optional: true,
   },
   slug: {
   type: String,
   optional: true,
   },
   title: {
   type: String,
   optional: true,
 },
 global: {
   label: "Scope",
   type: Boolean,
   optional: true,
 },
 region: {
   type: String,
   optional: true,
 }
}));
