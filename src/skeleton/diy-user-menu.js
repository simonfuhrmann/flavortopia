class DiyUserMenu extends DiyMixinRedux(DiyMixinRouter(Polymer.Element)) {
  static get is() {
    return 'diy-user-menu';
  }

  static get properties() {
    return {
      isUserSignedIn: {
        type: Boolean,
        statePath: 'user.auth.signedIn',
      },
      isUserAdmin: {
        type: Boolean,
        statePath: 'user.auth.isAdmin',
      }
    };
  }

  closeDropdown_() {
    this.$.dropdownMenu.opened = false;
  }

  onSigninTap_() {
    this.goUserSignin();
  }

  onSignoutTap_() {
    this.$.firebaseAuth.signOut();
    this.goHome();
  }

  onAdminTap_() {
    this.goAdministration();
  }
}

customElements.define(DiyUserMenu.is, DiyUserMenu);
