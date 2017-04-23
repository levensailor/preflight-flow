Template.admin.helpers({
  userTable: function(){
    var array = [];
      Meteor.users.find().map(function(c){
        array.push({name: c.profile.name, username: c.username, region: c.profile.region, role: c.profile.role});
      });
    return array;
  },
  wishTable: function(){
    var array = [];
      Wishes.find().map(function(c){
        array.push({user: c.wisher, wish: c.wish, page: c.page});
      });
    return array;
  },
  thisUser: function () {
    return Meteor.user().profile.name;
  },
  User: function() {
    var Users = Meteor.users.find({}, { sort: {createdAt: -1}}).fetch();
    return Users;
  },
  hasAvatar: function(id){
    if (typeof Meteor.users.findOne({_id: this._id}) !== 'undefined'){
      if (typeof Meteor.users.findOne({_id: this._id}).profile.avatarUrl !== 'undefined'){
        return true;
      }
      else return (false);
      }
  },
  hasInitials: function(id){
    if (typeof Meteor.users.findOne({_id: this._id}) !== 'undefined'){
      if (typeof Meteor.users.findOne({_id: this._id}).profile.initials !== 'undefined'){
        return true;
       }
       else return (false);
      }
  },
  thisAvatar: function(id){
    if (typeof Meteor.users.findOne({_id: this._id}) !== 'undefined'){
    var avatar = Meteor.users.findOne({_id: this._id}).profile.avatarUrl;
    return avatar;
    }
  },
  thisInitials: function(id){
    if (typeof Meteor.users.findOne({_id: this._id}) !== 'undefined'){
    var initials = Meteor.users.findOne({_id: this._id}).profile.initials;
    return initials;
    }
  },
  assignedUser: function(){
    var assignedUsers = TestPlans.findOne({_id: this._id}).assigned;
    return assignedUsers;
  },
  thisName: function(id){
    if (typeof Meteor.users.findOne({_id: this._id}) !== 'undefined'){
    var name = Meteor.users.findOne({_id: this._id}).profile.name;
    return name;
    }
  },
  thisRegion: function(id){
    if (typeof Meteor.users.findOne({_id: this._id}) !== 'undefined'){
      if (typeof Meteor.users.findOne({_id: this._id}).profile.region !== 'undefined'){
        var region = Meteor.users.findOne({_id: this._id}).profile.region;
        return region;
      }
    }
  },
  thisRole: function(id){
    if (typeof Meteor.users.findOne({_id: this._id}) !== 'undefined'){
      if (typeof Meteor.users.findOne({_id: this._id}).profile.role !== 'undefined'){
        var role = Meteor.users.findOne({_id: this._id}).profile.role;
        return role;
      }
    }
  },
  thisId: function(id){
    return id;
  },
  pdfExists: function(){
    if (typeof TestPlans.findOne({_id: this._id}).pdf !== 'undefined'){
    return true;
    }
    else return(false);
  },
  progress(){
    var projectCode = Session.get('projectCode');
    if (typeof TestPlans.findOne({project: projectCode}) !== 'undefined'){
      var thisTest = TestPlans.findOne({project: projectCode}).progress;
      thisTest = Math.max( Math.round(thisTest * 10) / 10, 2.8 ).toFixed(2);
      return thisTest+"%";
    }//if
  },
});

Template.admin.events({
  'click .reactive-table tbody tr': function (event) {
    event.preventDefault();
    var userName = this.username;
    console.log(this.username);
    if (typeof Meteor.users.findOne({username: this.username}) !== 'undefined'){
    var userId = Meteor.users.findOne({username: userName})._id;
//    console.log(this.role);
//    console.log(Meteor.users.findOne({_id: user._id}).profile.role);
    // checks if the actual clicked element has the class `delete`
    switch(event.target.className) {
//    if (event.target.className == "role") {
      case "role": {
        bootbox.prompt({
            title: "Select Privileges",
            inputType: 'select',
            inputOptions: [
              {text: "User", value: "User"},
              {text: "Manager", value: "Manager"},
              {text: "Director", value: "Director"},
              {text: "Admin", value: "Admin"},
            ],
            callback: function (result) {
              Meteor.call('changeRole', userId, result, (error, response) => {
                if (error){

                }else{}
              });
            }
        });
      }//case role
      break;
      case "region": {
        bootbox.prompt({
            title: "Select Region",
            inputType: 'select',
            inputOptions: [
              {text: "Carolinas", value: "Carolinas"},
              {text: "Gulf", value: "Gulf"},
              {text: "Tennessee", value: "Tennessee"},
              {text: "OK/AR", value: "OK/AR"},
              {text: "Florida", value: "Florida"},
              {text: "Georgia", value: "Georgia"},
            ],
            callback: function (result) {
              Meteor.call('changeRegion', userId, result, (error, response) => {
                if (error){

                }else{}
              });
            }
        });
      }
      break;
    }//big switch
//      if (Meteor.users.findOne({_id: user._id}).profile.role == "Admin" && typeof Meteor.users.findOne({_id: user._id} !== 'undefined')){
//        Meteor.users.update({_id: user._id}, {$set: {'profile.role': "User"}})
     }
//    }
  },
  'click .manage': function () {
    Session.set("projectCode", this.project);
    FlowRouter.go('/test/'+this.project);
  },
  'click .delete': function () {
    TestPlans.remove({"_id": this._id});
  },
  'click .download-pdf': function(){
    Meteor.call( 'downloadPdf', this._id, (error, response) => {
      if (error){
//          console.log(error.reason);
      }else{}
    });
  },
  'click .assign-test': function (){
    var id = this._id;
    var array = [];
      Meteor.users.find().map(function(c){
        array.push({text: c.profile.name, value: c._id});
      });
      bootbox.prompt({
          title: "Select Engineer To Assign",
          inputType: 'select',
          inputOptions: array,
          callback: function (result) {
            Meteor.call('assignUser', id, result, (error, response) => {
              if (error){

              }else{}
            });
          }
      });
  },
  'click .show-user': function (){
    var id = this.valueOf();
    if (typeof Meteor.users.findOne({_id: id}).profile.name !== 'undefined'){
      var Name = Meteor.users.findOne({_id: id}).profile.name;
    } else {var Name = ""};
    if (typeof Meteor.users.findOne({_id: id}).profile.title !== 'undefined'){
      var Title = Meteor.users.findOne({_id: id}).profile.title;
    } else {var Title = ""};
    if (typeof Meteor.users.findOne({_id: id}).profile.region !== 'undefined'){
      var Region = Meteor.users.findOne({_id: id}).profile.region;
    } else {var Region = ""};
    if (typeof Meteor.users.findOne({_id: id}).emails[0].address !== 'undefined'){
      var Email = Meteor.users.findOne({_id: id}).emails[0].address;
    } else {var Email = ""};

      var profile = Name+"\n"+Email+"\n\n"+Title+"\n"+Region;
//      console.log("profile: "+profile);
      bootbox.alert({
        size: "small",
        message: profile,
      });
//    }//if

}
});
Template.admin.onCreated(function() {
  var self = this;
  self.autorun(function() {
    Meteor.subscribe('AllUsers');
    Meteor.subscribe('Wishes');    
    var postSlug = FlowRouter.getParam('postSlug');
    self.subscribe('/', postSlug);
  });
});

Meteor.subscribe("TestPlans", "Sections", "Templates", "Wishes");
