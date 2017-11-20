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
        return { type: 'USER_SIGNIN', data };
      },
      userDetails(data) {
        return { type: 'USER_DETAILS', data };
      },
      userAdmin(data) {
        return { type: 'USER_ADMIN', data };
      },
    };
  }

  ready() {
    super.ready();
    // Register a handler when user authentication state changes.
    this.$.firebaseAuth.setupAuthStateHandler(firebaseUser => {
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
    const firebaseUser = this.getState().user.auth.firebaseUser;
    if (!firebaseUser || !firebaseUser.uid) {
      return;
    }

    // Load user details and store in Redux state. Once user details are
    // available, prompt the user to enter a display name if not already done.
    this.$.firebaseStore.getUserRecord(firebaseUser.uid)
        .then(snapshot => {
          let userDetails = { name: '' };
          if (snapshot && snapshot.exists) {
            userDetails = Object.assign(userDetails, snapshot.data());
          }
          this.dispatch('userDetails', userDetails);
          return snapshot;
        })
        .catch (error => {
          console.warn('Error loading user details: ' + error.message);
        });

    // Check if the user has admin permissions. Admins get additional UI.
    this.$.firebaseStore.getUserAdminRecord(firebaseUser.uid)
        .then(snapshot => {
          if (snapshot && snapshot.exists) {
            this.dispatch('userAdmin', { isAdmin: true });
          }
          return snapshot;
        })
        .catch(error => {
          console.warn('Error loading admin status: ' + error.message);
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
    this.$.firebaseStore.setUserName(firebaseUser.uid, displayName)
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

