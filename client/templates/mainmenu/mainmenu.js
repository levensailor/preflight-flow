Template.MainMenu.onCreated( () => {
  Template.instance().uploading = new ReactiveVar( false );
});

Template.MainMenu.events({
  'click .help': function (event, template){
//          $("#help-template").dropdown('toggle');
  //  $("#help-template").dropdown-toggle(data-toggle="dropdown");
    var tour = new Tour({
      name: "Pre-Preflight",

      steps: [
        {
          element: "#help-template",
          placement: 'bottom',
          title: "First Select a Technology",
          content: "UC, DC, Core, Mobility or Security",
          onNext: function(){
          }
        },
        {
          element: "#help-template",
          placement: 'right',
          title: "Test Plans are made up of one or more Templates",
          content: "Click on an Existing Template to Edit",
          onShown: function(){
          $("#help-template").dropdown('toggle');
          }
        },
        {
          element: "#help-template",
          placement: 'right',
          title: "Create New Templates",
          content: "Or if its easier, upload templates in bulk. The CSV format is included.",
          onShown: function(){
          $("#help-template").dropdown('toggle');
          }
        },
        {
          element: "#new-test",
          placement: 'bottom',
          title: "When you're ready to begin: Click New Test",
          content: "You'll then fill in all the required fields and click Generate Test Plan",
//          path: "/test"
        },
        {
          element: "#manage-test",
          placement: 'bottom',
          title: "Generated Test Plans can be found here",
          content: "Use as an archive, or tell your friends to help out with testing!",
//          path: "/archive"
        },
      ],

    });
       tour.init();
       tour.start();

  },
});
