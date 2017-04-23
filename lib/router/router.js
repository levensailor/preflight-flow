
//const previousPath;
//FlowRouter.triggers.exit([({path}) => {
//  previousPath = path;
//}]);

  var public = FlowRouter.group({
  //public route triggers, etc
  })

  var private = FlowRouter.group({
    triggersEnter: [AccountsTemplates.ensureSignedIn]
  })

  private.route('/', {
    action: function(params, queryParams) {
      BlazeLayout.render('layout', { content: "MainMenu"});
    },
    name: 'layout'
  })

  private.route('/templates', {
    action: function(params, queryParams) {
      BlazeLayout.render('layout', { content: "templates"});
    },
    name: 'layout'
  })

  private.route('/archive', {
    action: function(params, queryParams) {
      BlazeLayout.render('layout', { content: "archive"});
    },
    name: 'layout'
  })

  private.route('/admin', {
    action: function(params, queryParams) {
      BlazeLayout.render('layout', { content: "admin"});
    },
    name: 'layout'
  })

  private.route('/logout', {
    name: 'logout',
    action: function(params, queryParams){
      AccountsTemplates.logout();
    }
  });

  private.route('/test', {
    action: function(params, queryParams) {
      BlazeLayout.render('layout', { content: "testplan"});
    },
    name: 'layout'
  });

  private.route('/help', {
    action: function(params, queryParams) {
      BlazeLayout.render('layout', { content: "help"});
    },
    name: 'layout'
  });

  private.route('/test/:postSlug', {
    action: function(params, queryParams) {
      BlazeLayout.render('layout', {content: "test"});
    },
    name: 'layout'
  });

  private.route('/pf_example.csv', {
    action: function(params, queryParams) {
      BlazeLayout.render('layout', {content: "template"});
    },
    name: 'layout'
  });


  public.route('/', {
    action: function(params, queryParams) {
      BlazeLayout.render('defaultLayout', { });
    },
    name: 'defaultLayout'
  });

// As it is not possible to use template helpers in the page <head> we create a
// reactive function whose role is to set any page-specific tag in the <head>
// using the `kadira:dochead` package. Currently we only use it to display the
// board title if we are in a board page (see #364) but we may want to support
// some <meta> tags in the future.
const appTitle = 'Preflight Check';

// XXX The `Meteor.startup` should not be necessary -- we don't need to wait for
// the complete DOM to be ready to call `DocHead.setTitle`. But the problem is
// that the global variable `Boards` is undefined when this file loads so we
// wait a bit until hopefully all files are loaded. This will be fixed in a
// clean way once Meteor will support ES6 modules -- hopefully in Meteor 1.3.
