const passwordField = AccountsTemplates.removeField('password');
const emailField = AccountsTemplates.removeField('email');
AccountsTemplates.addFields([{
  _id: 'username',
  type: 'text',
  displayName: 'username',
  required: true,
  minLength: 2,
}, emailField, passwordField]);

AccountsTemplates.addFields([{
  _id: 'name',
  type: 'text',
  displayName: 'First Name, Last Name',
  required: true,
  minLength: 2,
},
{
_id: 'title',
type: 'text',
displayName: 'Title',
required: true,
minLength: 2,
},
{
_id: 'region',
type: 'select',
displayName: 'Region',
required: true,
minLength: 2,
select: [
  {text: "Carolinas", value: "Carolinas"},
  {text: "Gulf", value: "Gulf"},
  {text: "Tennessee", value: "Tennessee"},
  {text: "OK/AR", value: "OK/AR"},
  {text: "Florida", value: "Florida"},
  {text: "Georgia", value: "Georgia"},
]
},
]);


AccountsTemplates.configure({
  defaultLayout: 'userFormsLayout',
  defaultContentRegion: 'content',
  confirmPassword: false,
  enablePasswordChange: true,
  sendVerificationEmail: true,
  showForgotPasswordLink: true,
  onLogoutHook() {
    const homePage = '/';
    if (FlowRouter.getRouteName() === homePage) {
      FlowRouter.reload();
    } else {
      FlowRouter.go(homePage);
    }
  },
});



['signIn', 'signUp', 'resetPwd', 'forgotPwd', 'enrollAccount'].forEach(
  (routeName) => AccountsTemplates.configureRoute(routeName));

// We display the form to change the password in a popup window that already
// have a title, so we unset the title automatically displayed by useraccounts.
AccountsTemplates.configure({
  texts: {
    title: {
      changePwd: '',
    },
  },
});

AccountsTemplates.configureRoute('changePwd', {
  redirect() {
    // XXX We should emit a notification once we have a notification system.
    // Currently the user has no indication that his modification has been
    // applied.
    Popup.back();
  },
});
