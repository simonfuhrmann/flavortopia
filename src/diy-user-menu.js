class DiyUserMenu extends DiyMixinRedux(DiyMixinRouter(Polymer.Element)) {
  static get is() {
    return 'diy-user-menu';
  }

  static get properties() {
    return {
      userSignedIn: {
        type: Boolean,
        statePath: 'userAuth.signedIn',
      }
    };
  }

  ready() {
    super.ready();
    this.$.firebase.authSetupStateHandler();
  }

  onSigninTap_() {
    this.goSignin();
  }

  onSignoutTap_() {
    this.$.firebase.authSignOut();
    this.goHome();
  }
}

customElements.define(DiyUserMenu.is, DiyUserMenu);
