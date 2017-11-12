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

  static get actions() {
    return {
      userSignin(data) {
        return { type: 'USER_SIGNIN', data: data };
      },
      userDetails(data) {
        return { type: 'USER_DETAILS', data: data };
      }
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
    this.goHome();
  }

  onAuthStateChanged_(firebaseUser) {
    // Store the new authentication state in the Redux state.
    console.log('auth state changed', firebaseUser);
    this.dispatch('userSignin', {
      signedIn: !!firebaseUser,
      verified: !!firebaseUser && firebaseUser.emailVerified,
      firebaseUser: firebaseUser,
    });
    // Request additional user data after login. Once user details are
    // available, the <diy-app> component will prompt the user to enter a
    // display name if not already done.
    if (firebaseUser) {
      this.loadUserDetails_();
      this.goHome();
    }
  }

  loadUserDetails_() {
    // Load user details and store in Redux state.
    const firebaseUser = this.getState().user.auth.firebaseUser;
    this.$.firebase.loadUserDetails(firebaseUser.uid)
        .then(snapshot => {
          const userDetails = snapshot.val() || { name: '', email: '' };
          this.dispatch('userDetails', userDetails);
        })
        .catch (error => {
          console.warn('Error loading user details: ' + error.message);
        });
  }
}

customElements.define(DiyUserMenu.is, DiyUserMenu);
