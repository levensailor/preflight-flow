//For Transactions between Customer and Provider

Wishes = "Wishes";  // avoid typos, this string occurs many times.
Wishes = new Mongo.Collection(Wishes);

Wishes.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});

Meteor.methods({
  /**
   * Invoked by autoform to add a new Ride Data record.
   * @param doc The Wishes document.
   */
  /**
   *
   * Invoked by autoform to update a Ride Data record.
   * @param doc The Wishes document.
   * @param docID It's ID.
   */

});

// Publish the entire Collection.  Subscription performed in the router.
if (Meteor.isServer) {
  Meteor.publish('Wishes', function () {
    return Wishes.find();
  });
}

Meteor.isClient && Template.registerHelper("Wishes", Wishes);

 Wishes.attachSchema(new SimpleSchema({
   wisher: {
     type: String,
     optional: true,
   },
   wish: {
     type: String,
     optional: true,
   },
   page: {
     type: String,
     optional: true,
   }
}));
