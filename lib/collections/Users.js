//Users = Meteor.users;

Meteor.users.attachSchema(new SimpleSchema({
  username: {
    type: String,
    optional: true,
    autoValue() { // eslint-disable-line consistent-return
      if (this.isInsert && !this.isSet) {
        const name = this.field('profile.fullname');
        if (name.isSet) {
          return name.value.toLowerCase().replace(/\s/g, '');
        }
      }
    },
  },
  emails: {
    type: [Object],
    optional: true,
  },
  'emails.$.address': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  'emails.$.verified': {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    autoValue() { // eslint-disable-line consistent-return
      if (this.isInsert) {
        return new Date();
      } else {
        this.unset();
      }
    },
  },
  profile: {
    type: Object,
    optional: true,
    autoValue() { // eslint-disable-line consistent-return
      if (this.isInsert && !this.isSet) {
        return {};
      }
    },
  },
  'profile.avatarUrl': {
    type: String,
    optional: true,
  },
  'profile.initials': {
    type: String,
    optional: true,
  },
  'profile.assigned': {
    type: [String],
    optional: true,
  },
  'profile.name': {
    type: String,
    optional: true,
  },
  'profile.title': {
    type: String,
    optional: true,
  },
  'profile.region': {
    type: String,
    optional: true,
  },
  'profile.role':{
    type: String,
    optional: true,
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  heartbeat: {
    type: Date,
    optional: true,
  },
}));


// Search a user in the complete server database by its name or username. This
// is used for instance to add a new user to a board.



if (Meteor.isServer) {
  // Let mongoDB ensure username unicity
  Meteor.startup(() => {
    Meteor.users._collection._ensureIndex({
      username: 1,
    }, { unique: true });
  });
}
