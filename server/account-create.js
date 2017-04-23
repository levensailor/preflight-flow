Meteor.methods({

})
// keep on adding stufff

Accounts.onCreateUser(function(options, user) {
//  console.log("testingit aand if it works the nadd default properties for each user here");
//  console.log(user);
//  var userEmail = user.emails[0].address;
//  var userId = user._id;
//        Meteor.call( 'getSparkAvatar', userEmail, userId, ( error, res ) => {
//          if ( error ) {
//            console.log("error: "+error.reason );
//          } else {
//            console.log("result: "+res);
//          }
//        });
//  console.log("options email: "+options.emails[0].address)
   // Use provided profile in options, or create an empty object
   user.profile = options.profile || {};
   // Assigns first and last names to the newly created user object
   user.profile.firstName = options.firstName;
   user.profile.lastName = options.lastName;

   //default User Role
   user.profile.role = "User";
   // Returns the user object
   return user;
});

// Meteor.users.allow({
//   insert: function () {
//     return true;
//   },
//   update: function () {
//     return true;
//   },
//   remove: function () {
//     return true;
//   }
// })
