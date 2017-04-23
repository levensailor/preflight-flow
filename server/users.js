Meteor.methods({
    /**
     * Invoked by autoform to add a new Ride Data record.
     * @param doc The TestPlans document.
     */
     userAvatar: function(id){
       if (typeof Users.findOne({_id: id}) !== 'undefined'){
       var avatar = Users.findOne({_id: id}).profile.avatarUrl;
//       console.log(avatar);
       return avatar;
       }
     },
     userInitials: function(id){
       if (typeof Users.findOne({_id: id}) !== 'undefined'){
       var initials = Users.findOne({_id: id}).profile.initials;
       return initials;
       }
     },
     userHasAvatar: function(id){

  //     console.log("ss: "+id);
       if (typeof Users.findOne({_id: id}) !== 'undefined'){
  //              console.log("ss is defined for: "+id);
         if (typeof Users.findOne({_id: id}).profile.avatarUrl !== 'undefined'){
  //                console.log("ss avatar found: "+id);
           return true;
         }
         else return (false);
         }
     },
     userHasInitials: function(id){
       if (typeof Users.findOne({_id: id}) !== 'undefined'){
         if (typeof Users.findOne({_id: id}).profile.initials !== 'undefined'){
           return true;
          }
          else return (false);
         }
     },
     userName: function(id){
       if (typeof Users.findOne({_id: id}) !== 'undefined'){
       var name = Users.findOne({_id: id}).profile.name;
       return name;
       }
     },
     userTitle: function(id){
       if (typeof Users.findOne({_id: id}) !== 'undefined'){
         if (typeof Users.findOne({_id: id}).profile.title !== 'undefined'){
           var title = Users.findOne({_id: id}).profile.title;
           return title;
         }
         else {return " "};
       }
     },
     userEmail: function(id){
       if (typeof Users.findOne({_id: id}) !== 'undefined'){
         if (typeof Users.findOne({_id: id}).emails[0].address !== 'undefined'){
           var email = Users.findOne({_id: id}).emails[0].address;
           return email;
         }
       }
     },
     userRegion: function(id){
       if (typeof Users.findOne({_id: id}) !== 'undefined'){
         if (typeof Users.findOne({_id: id}).profile.region !== 'undefined'){
           var region = Users.findOne({_id: id}).profile.region;
           return region;
         }
         else {return " "};
       }
     },
     userRole: function(id){
       if (typeof Meteor.users.findOne({_id: id}) !== 'undefined'){
         if (typeof Meteor.users.findOne({_id: id}).profile.role !== 'undefined'){
           var role = Meteor.users.findOne({_id: id}).profile.role;
           return role;
         }
         else {return " "};
       }
     },
     changeRole: function(id, role){
       Meteor.users.update({_id: id}, {$set: { "profile.role": role}});
     },
     changeRegion: function(id, region){
       Meteor.users.update({_id: id}, {$set: { "profile.region": region}});
     },
     returnIp: function(){
       return this.connection.clientAddress;
     }
});


if (Meteor.isServer) {
    Meteor.publish("Users", function() {
        return Meteor.users.find();
      });
}
