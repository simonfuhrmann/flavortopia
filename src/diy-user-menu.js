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

  static get actions() {
    return {
      userSignin(data) {
        return { type: 'USER_SIGNIN', data: data };
      },
    };
  }

  ready() {
    super.ready();
    this.$.firebase.authSetupStateHandler(firebaseUser => {
      this.onAuthStateChanged_(firebaseUser);
    });
  }

  onSigninTap_() {
    this.goUserSignin();
  }

  onSignoutTap_() {
    this.$.firebase.authSignOut();
    this.onAuthStateChanged_(undefined);
    this.goHome();
  }

  onAuthStateChanged_(firebaseUser) {
    this.dispatch('userSignin', {
      signedIn: !!firebaseUser,
      firebaseUser: firebaseUser,
    });
  }
}

customElements.define(DiyUserMenu.is, DiyUserMenu);
