Template.test.onCreated( () => {
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
}

function initializeSignature(){
  wrapper1 = document.getElementById("1-signature-pad");
  wrapper2 = document.getElementById("2-signature-pad");

  canvas1 = wrapper1.querySelector("canvas");
  signaturePad1 = new SignaturePad(canvas1);

  canvas2 = wrapper2.querySelector("canvas");
  signaturePad2 = new SignaturePad(canvas2);


  // Adjust canvas coordinate space taking into account pixel ratio,
  // to make it look crisp on mobile devices.
  // This also causes canvas to be cleared.
  function resizeCanvas() {
      // When zoomed out to less than 100%, for some very strange reason,
      // some browsers report devicePixelRatio as less than 1
      // and only part of the canvas is cleared then.
      var ratio =  Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d").scale(ratio, ratio);
  }
}

var wrapper1,
    wrapper2,
    clearButton,
    saveButton,
    canvas1,
    canvas2,
    signaturePad;


  Template.test.rendered = function() {
    var postSlug = FlowRouter.getParam("postSlug");
    Session.set("projectCode", postSlug);
    var projectId = Session.get("projectCode");

    if (typeof TestPlans.findOne({'project': projectId}) !== 'undefined'){
      if (TestPlans.findOne({'project': projectId}).isCompleted){
        setTimeout(function() {initializeSignature()},250);
      }
    }
  //Session.set("selectedTest",null);
  //Session.set("projectCode",null);
  //Session.set("selectedTestPlan",null);


};

//  window.onresize = resizeCanvas;
//  resizeCanvas();



function addQuestionsToTest(thisTest, section){
  var thisSection = Templates.find({section: section}).fetch();

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

Template.test.events({
  "click [data-action=clear1]": function() {
    signaturePad1.clear();
  },
  "click [data-action=clear2]": function() {
    signaturePad2.clear();
  },
  "click [data-action=save1]": function() {
    if (signaturePad1.isEmpty()) {
        alert("Please provide signature first.");
    } else {
        window.open(signaturePad1.toDataURL());
    }
  },
  "click [data-action=save2]": function() {
    if (signaturePad2.isEmpty()) {
        alert("Please provide signature first.");
    } else {
        window.open(signaturePad2.toDataURL());
    }
  },
  'change #tests' ( template, event ) {
    var selectedValues = [];
    $("#tests :selected").each(function(){
        selectedValues.push($(this).val());
    });
    Session.set("selectedTests", selectedValues);
  },
  "click .pass": function(){
//    if (typeof signaturePad1 === undefined && typeof signaturePad2 === undefined){
  var projectId = Session.get("projectCode");
  console.log("clicked pass");
  var testId = TestPlans.findOne({"project": projectId})._id;
  var expected = this.expected;
  Meteor.call(
    'answerPass', testId, expected, ( error, response ) => {
    if ( error ) {
      console.log( error.reason );
    } else {
      console.log(TestPlans.find({_id: testId}).fetch().length);
    }
  });
//} else{this.unchecked = true;}
  },
  "click .fail": function(){
    var projectId = Session.get("projectCode");
    console.log("clicked fail");
    var testId = TestPlans.findOne({"project": projectId})._id;
    var expected = this.expected;
    Meteor.call( 'answerFail', testId, expected, ( error, response ) => {
      if ( error ) {
        console.log( error.reason );
      } else {
      }
    });
  },
  "keyup #comments": function(event, template){
    var projectId = Session.get("projectCode");
    var testId = TestPlans.findOne({"project": projectId})._id;
//    var expected = this.expected;
    var comments = event.target.value;
//    console.log(comments.target.value);
    Meteor.call( 'comments', testId, comments, ( error, response ) => {
      if ( error ) {
        console.log( error.reason );
      } else {
      }
    });
  },
  'click .create-pdf' : function () {
    Meteor.call("returnIp", function(err,res){
        Session.set('ipAddress', res);
//        var clientIp = res;
//        console.log(res);
      })
//    Meteor.pdf.save('My Cool Pdf', 'thispdf');
var projectId = Session.get("projectCode");
var testId = TestPlans.findOne({"project": projectId})._id;
if (signaturePad1.isEmpty() || signaturePad2.isEmpty()) {
  bootbox.alert({
    message: '<div class="text-center"><i class="fa fa-pencil fa-2x"></i> Must provide signature prior to generating PDF</div>',
    backdrop: true
  });
}
else{
if (typeof TestPlans.findOne({"_id": testId}).comments !== 'undefined'){
  var comments = TestPlans.findOne({"_id": testId}).comments;
}
else {
  var comments = (".");
};
//  var ipaddr = Meteor.call('getipAddr', (error, response) => {
//    if (error){
//      console.log( error.reason);
//    } else {
    var engSignature = signaturePad1.toDataURL();
    var custSignature = signaturePad2.toDataURL();
    var clientIp = Session.get('ipAddress');
    if (
      typeof clientIp !== 'undefined' &&
      typeof testId !== 'undefined' &&
      typeof projectId !== 'undefined' &&
      typeof comments !== 'undefined' &&
      typeof engSignature !== 'undefined' &&
      typeof custSignature !== 'undefined'
      ){
      Meteor.call( 'genAndDownloadPdf', testId, projectId, comments, engSignature, custSignature, clientIp, (error, response) => {
        if (error){
//          console.log(error.reason);
        }else{}
      });
    }
//    }
//  });
}//else
},
'click .download-pdf' : function () {
  var projectId = Session.get("projectCode");
  var testId = TestPlans.findOne({"project": projectId})._id;
      if (typeof testId !== 'undefined'){
      Meteor.call( 'downloadPdf', testId, (error, response) => {
        if (error){
          console.log(error);
        }else{}
      });
    }
//  });

},

//  'click .create-pdf' : function (){
//    var projectId = Session.get("projectCode");
//    var docDefinition = {
//      content: TestPlans.find({project: projectId}).fetch()
//    }
//    pdfMake.createPdf(docDefinition).open();
//  },
  'click .generate': function (){
    var projectCode = document.getElementById('projectCode');
    var ProjectCode = Session.set("projectCode", projectCode.value);
    var companyName = document.getElementById('companyName');
    var customerName = document.getElementById('customerName');
    var customerEmail = document.getElementById('customerEmail');
    var projectManagerEmail = document.getElementById('projectManagerEmail');
    var projectManagerName = document.getElementById('projectManagerName');
    var engineerEmail = Meteor.user().emails[0].address;
    console.log("project code: "+ projectCode.value+ " customerName: "+customerName.value+" customerEmail: "+customerEmail.value);
    var thisTest = TestPlans.insert({project: projectCode.value});
    var TestPlan = Session.set("selectedTestPlan", thisTest);
    var Sections = Session.get("selectedTests");
    var sectionString = Sections.join(", ");
    var technology = Session.get("selectedTechnology");
    var technologyLabel = whichTechnology(technology);
    TestPlans.update({_id: thisTest}, {$set: {'sections': sectionString}});
    TestPlans.update({_id: thisTest}, {$set: {'progress': "0"}});
    TestPlans.update({_id: thisTest}, {$set: {'companyName': companyName.value}});
    TestPlans.update({_id: thisTest}, {$set: {'companyName': companyName.value}});
    TestPlans.update({_id: thisTest}, {$set: {'technology': technology}});
    TestPlans.update({_id: thisTest}, {$set: {'technologyLabel': technologyLabel}});
    TestPlans.update({_id: thisTest}, {$set: {'customerName': customerName.value}});
    TestPlans.update({_id: thisTest}, {$set: {'customerEmail': customerEmail.value}});
    TestPlans.update({_id: thisTest}, {$set: {'engineerEmail': engineerEmail}});
    TestPlans.update({_id: thisTest}, {$set: {'projectManagerName': projectManagerName.value}});
    TestPlans.update({_id: thisTest}, {$set: {'projectManagerEmail': projectManagerEmail.value}});
    var Sections = Session.get("selectedTests");
//    console.log("#tests: "+selectedValues);
//    console.log("sections: "+Sections)
//    var array = Array.prototype.slice.call( Sections );
//    console.log("array: "+array);
    for (i=0; i<Sections.length; i++){
//      console.log("length: "+array[0][0].form[0].children.length);
//      console.log("0: "+array[0][0].form[0].children[0].childNodes[0].data);
      console.log("from I loop: "+Sections[i]);
//
//  addQuestionsToTest(thisTest, array[0][0].form[0].children[i].childNodes[0].data);
//      var section = array[0][0].form[0].children[i].childNodes[0].data;
      var thisSection = Templates.find({section: Sections[i]}).fetch();
      for (j=0; j<thisSection.length; j++){
        console.log("from J loop: "+thisSection[j].section);
      let objOfData = {
          description : thisSection[j].description,
          instructions : thisSection[j].instructions,
          expected : thisSection[j].expected,
          section : thisSection[j].section,
      }
      TestPlans.update({_id: thisTest}, {$push:  {test : { description :  objOfData.description , instructions :  objOfData.instructions , expected : objOfData.expected , section : objOfData.section , actual : "" , passfail : false , comments : "....." }}})
    }//for
    }//for
}
});




Template.test.helpers({
  uploading() {
    return Template.instance().uploading.get();
  },
  getSlug(){
    var postSlug = FlowRouter.getParam("postSlug");
    Session.set("projectCode", postSlug);
  }
});

Template.test.helpers({
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
    var projectCode = Session.get('projectCode');
    if (typeof TestPlans.findOne({project: projectCode}) !== 'undefined'){
      var assignedUsers = TestPlans.findOne({project: projectCode}).assigned;
      return assignedUsers;
    }
  },
  thisName: function(id){
    if (typeof Meteor.users.findOne({_id: id}) !== 'undefined'){
    var name = Meteor.users.findOne({_id: id}).profile.name;
    return name;
    }
  },
  theseSections() {
    return Sections.find().fetch();
  },
  progress(){
    var projectCode = Session.get('projectCode');
    if (typeof TestPlans.findOne({project: projectCode}) !== 'undefined'){
      var thisTest = TestPlans.findOne({project: projectCode}).progress;
      thisTest = Math.max( Math.round(thisTest * 10) / 10, 2.8 ).toFixed(2);
      if (thisTest <= 100){
      return thisTest+"%";
    }
    }//if
  },
  theseTechTemplates(){
    var Technology = Session.get("selectedTechnology");
    return Sections.find({technology: Technology}).fetch();
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

Template.test.helpers({
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
  },
  hasComment: function () {
    
  },
});

Template.test.events({
  'click .test-row': function () {
    Session.set("selectedTestId", this._id);
  },
  'click .delete': function () {
    Templates.remove({_id: Session.get("selectedTestId")});
  },
  'click .add-comment': function () {
    bootbox.prompt({
        title: "This is a prompt with a textarea!",
        inputType: 'textarea',
        callback: function (result) {
            console.log(result);
        }
    });
  },
  'click .mark-complete': function () {
    var projectId = Session.get("projectCode");
    var testId = TestPlans.findOne({project: projectId})._id;
    TestPlans.update({_id: testId}, { $set: {isCompleted: true}});
    setTimeout(function() {initializeSignature()},250);
  },
  'click .mark-incomplete': function () {
    var projectId = Session.get("projectCode");
    var testId = TestPlans.findOne({project: projectId})._id;
    TestPlans.update({_id: testId}, { $set: {isCompleted: false}});
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



Template.test.events({
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



Template.test.onCreated(function() {
  var self = this;
  self.autorun(function() {
    Meteor.subscribe('AllUsers');

    var postSlug = FlowRouter.getParam('postSlug');
    self.subscribe('/', postSlug);
  });
});

Template.test.helpers({
  thisUser: function(){
    if (Meteor.user()){
    return Meteor.user().profile.name;
  }
  },
  thisProject: function(){
    var project = Session.get("projectCode");
    if (typeof TestPlans.findOne({'project': project}) !== 'undefined'){
      var thisTest =  TestPlans.findOne({'project': project});
      return thisTest;
    }
  },
  theseQuestions: function(){
    var project = Session.get("projectCode");
    return TestPlans.find({'project': project}).fetch();
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
  isComplete: function(){
    var projectId = Session.get("projectCode");
    if (typeof TestPlans.findOne({'project': projectId}) !== 'undefined'){
      return TestPlans.findOne({project: projectId}).isCompleted;
    }
  },
  isIncomplete: function(){
    var projectId = Session.get("projectCode");
    if (typeof TestPlans.findOne({'project': projectId}) !== 'undefined'){
      return (!(TestPlans.findOne({project: projectId}).isCompleted));
    }
  },
  pdfGenerated: function(){
    var projectId = Session.get("projectCode");
    if (typeof TestPlans.findOne({'project': projectId}) !== 'undefined'){
      return (TestPlans.findOne({project: projectId}).hasPdf);
    }
  },
  pdfNotGenerated: function(){
    var projectId = Session.get("projectCode");
    if (typeof TestPlans.findOne({'project': projectId}) !== 'undefined'){
      return (!(TestPlans.findOne({project: projectId}).hasPdf));
    }
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
