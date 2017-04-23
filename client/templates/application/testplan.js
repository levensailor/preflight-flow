Template.testplan.onCreated( () => {
  Template.instance().uploading = new ReactiveVar( false );
});

function whichTechnology(technology){
  switch (technology){
    case 'UC':
      return '<i class="fa fa-phone fa-lg"></i>';
      break;
    case 'DC':
      return '<i class="fa fa-server fa-lg"></i>';
      break;
    case 'Core':
      return '<i class="fa fa-cloud fa-lg"></i>';
      break;
    case 'Mobility':
      return '<i class="fa fa-wifi fa-lg"></i>';
      break;
    case 'Security':
      return '<i class="fa fa-shield fa-lg"></i>';
      break;
  }
//    return thisTechnology;
  }





  Template.testplan.rendered = function() {
  Session.set("selectedTest",null);
  Session.set("projectCode",null);
  Session.set("selectedTestPlan",null);
  Session.set("selectedTechnology", "UC");
  var postSlug = FlowRouter.getParam('postSlug');
  var thisGlobal = Sections.findOne({slug: postSlug}).global;
  Session.set('global', thisGlobal);

    $(document).ready(function() {
    $(".js-example-basic-single").select2();
    $(".js-example-basic-multiple").select2();
    $(".js-example-basic-hide-search").select2({
      minimumResultsForSearch: Infinity
      });
    });//doc-ready
};

//  window.onresize = resizeCanvas;
//  resizeCanvas();



function addQuestionsToTest(thisTest, section){
//  console.log(section);
  var thisSection = Templates.find({section: section}).fetch();
//console.log(thisSection);

for (i=0; i<thisSection.length; i++){
  let objOfData = {
    description : thisSection[i].description,
    instructions : thisSection[i].instructions,
    expected : thisSection[i].expected,
    section : thisSection[i].section,
  }
  TestPlans.update({_id: thisTest}, {$push:  {test : { description :  objOfData.description , instructions :  objOfData.instructions , expected : objOfData.expected , section : objOfData.section , actual : "" , passfail : false , comments : "....." }}})
}
};

Template.testplan.events({
  'change #tests' ( template, event ) {
    var selectedValues = [];
    $("#tests :selected").each(function(){
        selectedValues.push($(this).val());
    });
    Session.set("selectedTests", selectedValues);
  },
  "change .form-technology": function(){
    Session.set("selectedTechnology", document.getElementById("technology").value);
  },
  "click .form-technology": function(){
    Session.set("selectedTechnology", document.getElementById("technology").value);
  },
  'click .generate': function (){
    //define all variables
    var projectCode = document.getElementById('projectCode');
    var ProjectCode = Session.set("projectCode", projectCode.value);
    var companyName = document.getElementById('companyName');
    var customerName = document.getElementById('customerName');
    var customerEmail = document.getElementById('customerEmail');
    var projectManagerEmail = document.getElementById('projectManagerEmail');
    var projectManagerName = document.getElementById('projectManagerName');
    var engineerName = Meteor.user().profile.name;
    var engineerRegion = Meteor.user().profile.region;
    var engineerTitle = Meteor.user().profile.title;
    var engineerEmail = Meteor.user().emails[0].address;
//    console.log("project code: "+ projectCode.value+ " customerName: "+customerName.value+" customerEmail: "+customerEmail.value);
    var thisTest = TestPlans.insert({project: projectCode.value});
    var TestPlan = Session.set("selectedTestPlan", thisTest);
    var Sections = Session.get("selectedTests");
    var technology = Session.get("selectedTechnology");
    var technologyLabel = whichTechnology(technology);

    if (
      projectCode.value == '' ||
      companyName.value == '' ||
      customerName.value == '' ||
      customerEmail.value == '' ||
      projectManagerName.value == '' ||
      projectManagerEmail.value == ''
    ){
      bootbox.alert({
        message: '<div class="text-center"><i class="fa fa-pencil fa-2x"></i> Please fill in all fields before generating test</div>',
        backdrop: true
      });
    }
    else {
    var sectionString = Sections.join(", ");
    TestPlans.update({_id: thisTest}, {$set: {'sections': sectionString}});
    TestPlans.update({_id: thisTest}, {$set: {'region': engineerRegion}});
    TestPlans.update({_id: thisTest}, {$set: {'numQuestions': "0"}});
    TestPlans.update({_id: thisTest}, {$set: {'companyName': companyName.value}});
    TestPlans.update({_id: thisTest}, {$set: {'companyName': companyName.value}});
    TestPlans.update({_id: thisTest}, {$set: {'technology': technology}});
    TestPlans.update({_id: thisTest}, {$set: {'technologyLabel': technologyLabel}});
    TestPlans.update({_id: thisTest}, {$set: {'customerName': customerName.value}});
    TestPlans.update({_id: thisTest}, {$set: {'customerEmail': customerEmail.value}});
    TestPlans.update({_id: thisTest}, {$set: {'engineerName': engineerName}});
    TestPlans.update({_id: thisTest}, {$set: {'engineerTitle': engineerTitle}});
    TestPlans.update({_id: thisTest}, {$set: {'engineerEmail': engineerEmail}});
    TestPlans.update({_id: thisTest}, {$set: {'projectManagerName': projectManagerName.value}});
    TestPlans.update({_id: thisTest}, {$set: {'projectManagerEmail': projectManagerEmail.value}});
    Meteor.call('assignUser', thisTest, Meteor.user()._id, (error, response) => {
      if (error){

      }else{}
    });

    var Sections = Session.get("selectedTests");
//    console.log("#tests: "+selectedValues);
//    console.log("sections: "+Sections)
//    var array = Array.prototype.slice.call( Sections );
//    console.log("array: "+array);
    for (i=0; i<Sections.length; i++){
//      console.log("length: "+array[0][0].form[0].children.length);
//      console.log("0: "+array[0][0].form[0].children[0].childNodes[0].data);
//
//  addQuestionsToTest(thisTest, array[0][0].form[0].children[i].childNodes[0].data);
//      var section = array[0][0].form[0].children[i].childNodes[0].data;
      var thisSection = Templates.find({section: Sections[i]}).fetch();
      var numQuestions = TestPlans.find({_id: thisTest}).fetch();
      var questions = (numQuestions[0].numQuestions+thisSection.length);
      TestPlans.update({_id: thisTest}, {$set: {'numQuestions' : questions}});
      for (j=0; j<thisSection.length; j++){
//j = number of questions

      let objOfData = {
          description : thisSection[j].description,
          instructions : thisSection[j].instructions,
          expected : thisSection[j].expected,
          section : thisSection[j].section,
      }
      TestPlans.update({_id: thisTest}, {$push:  {test : { description :  objOfData.description , instructions :  objOfData.instructions , expected : objOfData.expected , section : objOfData.section , actual : "" , passfail : false , comments : "....." }}})
    }//for
    }//for
    FlowRouter.go('/test/'+projectCode.value);
    Meteor.call(
      'attachSparkRoom', thisTest, ( error, response ) => {
      if ( error ) {
        console.log( error.reason );
      } else {

      }
    });
  }//else
}//generate
});




Template.testplan.helpers({
  uploading() {
    return Template.instance().uploading.get();
  },
  getSlug(){
    var postSlug = FlowRouter.getParam("postSlug");
    console.log("slug: "+postSlug);
  }
});

Template.testplan.helpers({
  theseSections() {
    return Sections.find().fetch();
  },
  theseTechTemplates(){
    if (typeof Meteor.user() !== "undefined" ){
      var myRegion = Meteor.user().profile.region;
      var Technology = Session.get("selectedTechnology");
      return Sections.find({
        $and: [
          {'technology': Technology},
          {
            $or: [
              {'region' : myRegion},
              {'global' : true}

            ]
          }
        ]
      }).fetch();
    }
  },
  sectionSlug() {
    return "http://localhost"+Sections.findOne().slug;
  },
  theseQuestions(){
    var selectedTestId = Session.get('selectedTestPlan');
    return TestPlans.find({_id: selectedTestId}).fetch();
  },
  thisProjectCode(){
    var projectCode = Session.get("projectCode");
    return projectCode + "TP";
  },
});

Session.setDefault("autoSaveMode", true);

Template.testplan.helpers({
  tests: function () {
    return Templates.find();
  },
  autoSaveMode: function () {
    return Session.get("autoSaveMode");
  },
  selectedTestDoc: function () {
    return Templates.findOne(Session.get("selectedTestId"));
  },
  isSelectedTest: function () {
    return Session.equals("selectedTestId", this._id);
  },
  formType: function () {
    if (Session.get("selectedTestId")) {
      return "update";
    } else {
      return "disabled";
    }
  },
  disableButtons: function () {
    return !Session.get("selectedTestId");
  }
});

Template.testplan.events({
  'click .test-row': function () {
    Session.set("selectedTestId", this._id);
  },
  'click .delete': function () {
    Templates.remove({_id: Session.get("selectedTestId")});
  }
});



Template.testplan.events({
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



Template.testplan.onCreated(function() {
  var self = this;
  self.autorun(function() {
    Meteor.subscribe('AllUsers');
    var postSlug = FlowRouter.getParam('postSlug');
    self.subscribe('/', postSlug);
  });
});

Template.testplan.helpers({
  thisUser: function(){
    if (Meteor.user()){
    return Meteor.user().profile.name;
  }
  },
  project: function(){
    return Session.get('projectCode');
  },
  testPlan: function(){
    return Session.get('selectedTestPlan');
  },
  thisTitle: function(){
    if (Meteor.user()){
    return Meteor.user().profile.title;
  }
  },
  thisEmail: function(){
    if (Meteor.user()){
    return Meteor.user().emails[0].address;
  }
  },
  thisDate: function(){
    var date = new Date();
    return date.toLocaleDateString();
  },
  section: function() {
    var postSlug = FlowRouter.getParam('postSlug');
    var thisSection = Sections.findOne({slug: postSlug}).section;
    var sectionTests = Templates.find({section: thisSection}).fetch();
    return sectionTests;
  },
  technologies: function(){
    return Session.get('selectedTechnology');
//    console.log ("editing equals "+Session.equals('selectedTestId', this._id));
  },
});

// this has to be here (does not work in the helper statement) or the data is not delivered to blogHome
Meteor.subscribe("TestPlans", "Sections", "Templates");
