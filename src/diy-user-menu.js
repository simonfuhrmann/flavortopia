class DiyUserMenu extends DiyMixinRedux(DiyMixinRouter(Polymer.Element)) {
  static get is() {
    return 'diy-user-menu';
  }

  static get properties() {
    return {
      userSignedIn: {
        type: Boolean,
        statePath: 'user.auth.signedIn',
      },
    };
  }

  onSigninTap_() {
    this.goUserSignin();
  }

  onSignoutTap_() {
    this.$.firebase.authSignOut();
    this.goHome();
  }
}

customElements.define(DiyUserMenu.is, DiyUserMenu);
