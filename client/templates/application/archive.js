Template.archive.helpers({
  thisUser: function () {
    return Meteor.user().profile.name;
  },
  isAdminOrDirector: function(){
    if (typeof Meteor.user() !== 'undefined'){
      var role = Meteor.user().profile.role;
      if (role == "Admin" || role == "Director"){
        return true;
      }
      else return (false);
    }
  },
  assignedOrManagerSubset: function() {
    if (typeof Meteor.user() !== 'undefined'){
      var userId = Meteor.user()._id;
      var role = Meteor.user().profile.role;
      var region = Meteor.user().profile.region;
      if (role == "Manager"){
        var managerTests = TestPlans.find({'region': region}, {sort: {createdAt: -1}}).fetch();
        return managerTests;
      }
      else {
        var assignedTests = TestPlans.find({'assigned': userId}, {sort: {createdAt: -1}}).fetch();
        return assignedTests;
      }
    }
  },
  testPlan: function() {
    var testPlans = TestPlans.find({}, { sort: {createdAt: -1}}).fetch();
    return testPlans;
  },
  hasAvatar: function(id){
    if (typeof Meteor.users.findOne({_id: id}) !== 'undefined'){
      if (typeof Meteor.users.findOne({_id: id}).profile.avatarUrl !== 'undefined'){
        return true;
      }
      else return (false);
      }
  },
  hasInitials: function(id){
    if (typeof Meteor.users.findOne({_id: id}) !== 'undefined'){
      if (typeof Meteor.users.findOne({_id: id}).profile.initials !== 'undefined'){
        return true;
       }
       else return (false);
      }
  },
  thisAvatar: function(id){
    if (typeof Meteor.users.findOne({_id: id}) !== 'undefined'){
    var avatar = Meteor.users.findOne({_id: id}).profile.avatarUrl;
    return avatar;
    }
  },
  thisInitials: function(id){
    if (typeof Meteor.users.findOne({_id: id}) !== 'undefined'){
    var initials = Meteor.users.findOne({_id: id}).profile.initials;
    return initials;
    }
  },
  assignedUser: function(){
    var assignedUsers = TestPlans.findOne({_id: this._id}).assigned;
    return assignedUsers;
  },
  thisName: function(id){
    if (typeof Meteor.users.findOne({_id: id}) !== 'undefined'){
    var name = Meteor.users.findOne({_id: id}).profile.name;
    return name;
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

Template.archive.events({
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
            if (result !== null){
            Meteor.call('assignUser', id, result, (error, response) => {
              if (error){

              }else{
                console.log(result);
                if (typeof TestPlans.findOne({_id:id}).sparkId !== 'undefined' && TestPlans.findOne({_id:id}).project !== 'undefined'){
                  var sparkId = TestPlans.findOne({_id: id}).sparkId;
                  if (typeof Meteor.users.findOne({_id: result}) !== 'undefined'){
                  var assignName = Meteor.users.findOne({_id: result}).profile.name;
                  var assignEmail = Meteor.users.findOne({_id: result}).emails[0].address;
                  var projectCode = TestPlans.findOne({_id: id}).project;
                  var url = "https://preflight.presidio.cloud/test/"+projectCode;
                  var message = assignName+": You've been assigned a test plan: "+url;
                  }
                  console.log("this profile name: "+assignName);
                  console.log("this spark user: "+assignEmail);
                  Meteor.call('addSparkUser', sparkId, assignEmail, (error, response) => {
                    if (error){

                    }else{
                      Meteor.call('msgSparkRoom', sparkId, message, (error, response) => {
                        if (error){

                        }else{}
                      });//sparkUser

                    }
                  });//sparkUser




                }//if
              }//else

            });
            }
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
Template.archive.onCreated(function() {
  var self = this;
  self.autorun(function() {
    Meteor.subscribe('AllUsers');
    var postSlug = FlowRouter.getParam('postSlug');
    self.subscribe('/', postSlug);
  });
});

Meteor.subscribe("TestPlans", "Sections", "Templates");
