class DiyUserAuth extends DiyMixinRouter(DiyMixinRedux((Polymer.Element))) {
  static get is() {
    return 'diy-user-auth';
  }

  static get properties() {
    return {
      userDetails: {
        type: Object,
        statePath: 'user.details',
        observer: 'onUserDetailsChanged_',
      }
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
    // Register a handler when user authentication state changes.
    this.$.firebase.authSetupStateHandler(firebaseUser => {
      this.onAuthStateChanged_(firebaseUser);
    });
  }

  onAuthStateChanged_(firebaseUser) {
    // Store the new authentication state in the Redux state.
    this.dispatch('userSignin', {
      signedIn: !!firebaseUser,
      verified: !!firebaseUser && firebaseUser.emailVerified,
      firebaseUser: firebaseUser,
    });
    // Request additional user data after login.
    if (firebaseUser) {
      this.loadUserDetails_();
    }
  }

  loadUserDetails_() {
    // Load user details and store in Redux state. Once user details are
    // available, prompt the user to enter a display name if not already done.
    const firebaseUser = this.getState().user.auth.firebaseUser;
    this.$.firebase.loadUserDetails(firebaseUser.uid)
        .then(snapshot => {
          const val = snapshot.val();
          const userDetails = { name: '', email: '' };
          if (val && val.public && val.public.name) {
            userDetails.name = val.public.name;
          }
          if (val && val.private && val.private.email) {
            userDetails.email = val.private.email;
          }
          this.dispatch('userDetails', userDetails);
        })
        .catch (error => {
          console.warn('Error loading user details: ' + error.message);
        });
  }

  onUserDetailsChanged_(userDetails) {
    // Open a dialog if the user does not have a display name set.
    if (userDetails && userDetails.name === '') {
      this.$.enterDisplayNameDialog.open();
    }
  }

  onSetDisplayNameTap_() {
    // Get the display name from the input field.
    this.$.displayNameInput.setError('');
    const displayName = this.$.displayNameInput.value;
    if (!displayName) {
      this.$.displayNameInput.setError('Name must not be empty');
      return;
    }

    // Persist the user's display name to the database.
    const firebaseUser = this.getState().user.auth.firebaseUser;
    const uid = firebaseUser.uid;
    const email = firebaseUser.email;
    this.$.firebase.writeUserDetails(uid, email, displayName)
        .then(data => {
          this.$.enterDisplayNameDialog.close();
          return data;
        })
        .catch (error => {
          this.$.displayNameInput.setError('Name must be at least 3 letters');
          throw error;
        });
  }
}

customElements.define(DiyUserAuth.is, DiyUserAuth);

