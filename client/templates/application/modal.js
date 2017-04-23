Template.modal.onRendered(function(){
  var tmpl = this;
  $('#test-row').modal();
  console.log(tmpl.data);
});

Session.setDefault("autoSaveMode", true);

Template.modal.helpers({
  test: function () {
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

Template.modal.events({
  'click .test-row': function () {
    Session.set("selectedTestId", this._id);
    Modal.show('modal');
  },
  'click .delete': function () {
  Modal.hide('modal');
  }
});



// this has to be here (does not work in the helper statement) or the data is not delivered to blogHome
Meteor.subscribe("Sections", "Templates");
