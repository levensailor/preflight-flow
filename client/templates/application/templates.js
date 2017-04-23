Template.templates.onCreated( () => {
  Template.instance().uploading = new ReactiveVar( false );
});
EditableText.saveOnFocusout=true;
Template.templates.helpers({
  uploading() {
    return Template.instance().uploading.get();
  }
});

Template.templates.helpers({
  theseSections() {
    return Sections.find().fetch();
  },
  thisSection() {
    return Session.get("selectedSection");
    console.log("selectedSection" +selectedSection);
  }
});

Template.templates.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var session = Session.get("selectedSection");
    if (typeof Sections.findOne({_id: session}) !== 'undefined'){
    var scope = Sections.findOne({_id: session}).global;
    }
    Session.set("global", scope);
    Meteor.subscribe('Sections');
  });
});

Template.templates.events({
  'click .test-row': function (evt,tmpl) {
//    console.log("tmpl "+tmpl);
//    console.log("tmpl.data "+tmpl.data);
//  dataToModal = {
//    id: tmpl.data._id
//  };
//  Blaze.renderWithData(Template.modal, dataToModal, document.body)
//    Session.set("selectedTestId", this._id);
//    autosize(document.getElementById('test-row'));

//    Modal.show('modal');
  },
  'click .section': function () {
    console.log ("id from click "+this._id);
    Session.set("selectedSection", this._id);
  },
  'click .add-test': function(){
    var selectedSection = Session.get("selectedSection");
    var thisSection = Sections.findOne({_id: selectedSection}).section;
    var thisProduct = Sections.findOne({_id: selectedSection}).product;
    var thisTechnology = Sections.findOne({_id: selectedSection}).technology;
    var addedTest = Templates.insert(
      {
        section: thisSection,
        product: thisProduct,
        technology: thisTechnology,
        description: "...",
        instructions: "....",
        expected: "....."
      });
  },
  'click .del-test': function(){
//    console.log("clicked id: "+this._id);
    Templates.remove({_id: this._id});
  },
  'click .del-template': function(){
    var selectedSection = Session.get("selectedSection");
    var thisSection = Sections.findOne({_id: selectedSection}).section;
    var theseTemplates = Templates.find({section: thisSection}).fetch();
    Sections.remove({_id: selectedSection});

    for (i=0; i<theseTemplates.length; i++){
      Templates.remove({_id: theseTemplates[i]._id});
    }
    Bert.alert( 'Template Deleted: ' +thisSection, 'danger', 'growl-top-right' );
    FlowRouter.go('/');
  },
  'click .templates-menu': function(){
//    console.log("clicked id: "+this._id);
    Session.set("selectedSection", null);
  },
  'change [name="uploadCSV"]' ( event, template ) {
    template.uploading.set( true );

    Papa.parse( event.target.files[0], {
      header: true,
      complete( results, file ) {
        console.log("data: "+results.data);
        Meteor.call( 'parseUpload', results.data, ( error, response ) => {
          if ( error ) {
            console.log( error.reason );
          } else {
            template.uploading.set( false );
            Bert.alert( 'Upload complete!', 'success', 'growl-top-right' );
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



// Applied globally on all textareas with the "autoExpand" class
$(document)
    .one('focus.test', 'textarea.test', function(){
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.test', 'textarea.test', function(){
        var minRows = this.getAttribute('data-min-rows')|0, rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
        this.rows = minRows + rows;
    });


Template.templates.helpers({
  toggle_A_options: function(){
    var scope = Session.get("global");
    var section = Session.get("selectedSection");
    if (typeof Meteor.user() !== "undefined" ){
    var region = Meteor.user().profile.region;
    Sections.update ({_id: section}, { $set: {'region': region}});
    }

    if (typeof Sections.findOne({_id: section}) !== 'undefined'){
    Sections.update({_id: section}, {$set: {global: scope}});
    }
    return {
      "size": "small",
      "on": "Global",
      "off": "Regional",
      "offstyle": "danger"
    }
  },

  section: function() {
    var sectionId = Session.get('selectedSection');
    if (typeof Sections.findOne({_id: sectionId}) !== 'undefined'){
      var thisSection = Sections.findOne({_id: sectionId}).section;
      var sectionTests = Templates.find({section: thisSection}).fetch();
      return sectionTests;
    }
  },
  sections: function(){
    return Session.get('selectedSection');
//    console.log ("editing equals "+Session.equals('selectedTestId', this._id));
  },
  whichSection: function(){
    var selectedSection = Session.get('selectedSection');
    if (typeof Sections.findOne({_id: selectedSection}) !== 'undefined'){
    var thisSection = Sections.findOne({_id: selectedSection}).section;
    return thisSection;
    }
  },
  whichProduct: function(){
    var selectedSection = Session.get('selectedSection');
    if (typeof Sections.findOne({_id: selectedSection}) !== 'undefined'){
    var thisProduct = Sections.findOne({_id: selectedSection}).product;
    return thisProduct;
    }
  },
  whichTechnology: function(){
    var selectedSection = Session.get('selectedSection');
    if (typeof Sections.findOne({_id: selectedSection}) !== 'undefined'){
    var thisTechnology = Sections.findOne({_id: selectedSection}).technology;
    switch (thisTechnology){
      case 'UC':
        return '<i class="fa fa-phone fa-lg"></i> UC';
        break;
      case 'DC':
        return '<i class="fa fa-server fa-lg"></i> DC';
        break;
      case 'Core':
        return '<i class="fa fa-cloud fa-lg"></i> Core';
        break;
      case 'Mobility':
        return '<i class="fa fa-wifi fa-lg"></i> Mobility';
        break;
      case 'Security':
        return '<i class="fa fa-shield fa-lg"></i> Security';
        break;
    }
//    return thisTechnology;
    }
  }
});


// this has to be here (does not work in the helper statement) or the data is not delivered to blogHome
Meteor.subscribe("Templates");
