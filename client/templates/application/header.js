Template.layout.onCreated( () => {
  Template.instance().uploading = new ReactiveVar( false );
});

Template.layout.helpers({
  uploading() {
    return Template.instance().uploading.get();
  }
});

//$('.dropdown-toggle').dropdown()

Template.layout.helpers({
    thisUser: function () {
      return Meteor.user().profile.name;
    },
    isAdmin: function (){
      if (typeof Meteor.user() !== 'undefined'){
      if (Meteor.user().profile.role == "Admin"){
        return true;
      }
      else {return false}
      }
    },
    thisAvatar: function(){
      return Meteor.user().profile.avatarUrl;
    },
    thisInitials: function(){
      return Meteor.user().profile.initials;
    },
    hasAvatar: function(){
      Meteor.call( 'getSparkAvatar', Meteor.user().emails[0].address, Meteor.user()._id, ( error, response ) => {
        if ( error ) {
          console.log( error.reason );
        } else {
        }
      });
      var avatar =  Meteor.user().profile.avatarUrl;
      if (avatar){
        return true;
      }
    },
    theseUCTemplates: function () {
      if (typeof Meteor.user() !== "undefined" ){
        var myRegion = Meteor.user().profile.region;
        return Sections.find({
          $and: [{
            technology: 'UC',
            $or: [
              {'region': myRegion},
              {'global': true},
            ]
          }]
        }).fetch();
      }
    },
    theseDCTemplates: function () {
      if (typeof Meteor.user() !== "undefined" ){
        var myRegion = Meteor.user().profile.region;
        return Sections.find({
          $and: [{
            technology: 'DC',
            $or: [
              {'region': myRegion},
              {'global': true},
            ]
          }]
        }).fetch();
      }
    },
    theseCoreTemplates: function () {
      if (typeof Meteor.user() !== "undefined" ){
        var myRegion = Meteor.user().profile.region;
        return Sections.find({
          $and: [{
            technology: 'Core',
            $or: [
              {'region': myRegion},
              {'global': true},
            ]
          }]
        }).fetch();
      }
    },
    theseSecurityTemplates: function () {
      if (typeof Meteor.user() !== "undefined" ){
        var myRegion = Meteor.user().profile.region;
        return Sections.find({
          $and: [{
            technology: 'Security',
            $or: [
              {'region': myRegion},
              {'global': true},
            ]
          }]
        }).fetch();
      }
    },
    theseMobilityTemplates: function () {
      if (typeof Meteor.user() !== "undefined" ){
        var myRegion = Meteor.user().profile.region;
        return Sections.find({
          $and: [{
            technology: 'Mobility',
            $or: [
              {'region': myRegion},
              {'global': true},
            ]
          }]
        }).fetch();
      }
    },
    noUser: function () {
        var user = Meteor.user();
        if (!user) {
            return true;
        };
    }
});

Template.layout.events({
  'click .template-menu': function () {
    Session.set("selectedSection", this._id);
  },
  'click .makewish' : function(){
    bootbox.prompt({
    title: "Make a wish for this page!",
    inputType: 'textarea',
    callback: function (result) {
      if (typeof result !== 'undefined' && typeof Meteor.user() !== 'undefined') {
        var wisher = Meteor.user().profile.name;
        var wish = result;
        var page = FlowRouter.current().path;
        if (wish !== '' && wish !== null){
        Wishes.insert({'wisher': wisher, 'wish': wish, 'page': page}, {upsert: true});
        Bert.alert( 'Here\'s to wishing!: \n' +result, 'success', 'growl-top-right' );
        }
      }
    }
});
  },
  'click .add-uc-template': function () {
    var technology = "UC";
    bootbox.prompt({
      size: "small",
        title: "New Template Name",
        callback: function (result) {

          Meteor.call(
          'newTemplate',
          result,
          technology,
             function(err, res) {
               if(err) {
               } else {
                 Session.set("selectedSection", res);
                 Bert.alert( 'Template Created: ' +result, 'success', 'growl-top-right' );
                 FlowRouter.go('/templates');

                 }
              }//function
            );//call to msgRoom



        }
    });
  },
  'click .add-dc-template': function () {
    var technology = "DC";
    bootbox.prompt({
      size: "small",
        title: "New Template Name",
        callback: function (result) {
          Meteor.call(
          'newTemplate',
          result,
          technology,
             function(err, res) {
               if(err) {
               } else {
                 Session.set("selectedSection", res);
                 Bert.alert( 'Template Created: ' +result, 'success', 'growl-top-right' );
                 FlowRouter.go('/templates');

                 }
              }//function
            );
        }
    });
  },
  'click .add-core-template': function () {
    var technology = "Core";
    bootbox.prompt({
      size: "small",
        title: "New Template Name",
        callback: function (result) {
          Meteor.call(
          'newTemplate',
          result,
          technology,
             function(err, res) {
               if(err) {
               } else {
                 Session.set("selectedSection", res);
                 Bert.alert( 'Template Created: ' +result, 'success', 'growl-top-right' );
                 FlowRouter.go('/templates');

                 }
              }//function
            );
        }
    });
  },
  'click .add-security-template': function () {
    var technology = "Security";
    bootbox.prompt({
      size: "small",
        title: "New Template Name",
        callback: function (result) {
          Meteor.call(
          'newTemplate',
          result,
          technology,
             function(err, res) {
               if(err) {
               } else {
                 Session.set("selectedSection", res);
                 Bert.alert( 'Template Created: ' +result, 'success', 'growl-top-right' );
                 FlowRouter.go('/templates');

                 }
              }//function
            );
        }
    });
  },
  'click .add-mobility-template': function () {
    var technology = "Mobility";
    bootbox.prompt({
      size: "small",
        title: "New Template Name",
        callback: function (result) {
          Meteor.call(
          'newTemplate',
          result,
          technology,
             function(err, res) {
               if(err) {
               } else {
                 Session.set("selectedSection", res);
                 Bert.alert( 'Template Created: ' +result, 'success', 'growl-top-right' );
                 FlowRouter.go('/templates');

                 }
              }//function
            );
        }
    });
  },
  'change [name="uploadCSV"]' ( event, template ) {
    template.uploading.set( true );

    Papa.parse( event.target.files[0], {
      header: true,
      complete( results, file ) {
        Meteor.call( 'parseUpload', results.data, ( error, response ) => {
          if ( error ) {
            console.log( error.reason );
          } else {
            template.uploading.set( false );
            console.log(this._id);
            Session.set("selectedSection", this._id);
            Bert.alert( 'Upload complete!', 'success', 'growl-top-right' );
            FlowRouter.go('/');
          }
        });
      }
    });
  }
});

var inputs = document.querySelectorAll( '.inputfile' );
Array.prototype.forEach.call( inputs, function( input )
{
  var label	 = input.nextElementSibling,
    labelVal = label.innerHTML;

  input.addEventListener( 'change', function( e )
  {
    var fileName = '';
    if( this.files && this.files.length > 1 )
      fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
    else
      fileName = e.target.value.split( '\\' ).pop();

    if( fileName )
      label.querySelector( 'span' ).innerHTML = fileName;
    else
      label.innerHTML = labelVal;
  });
});
