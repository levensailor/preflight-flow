// Here is all my publications

Meteor.publish('AllUsers',function() {
    return Meteor.users.find();
})
