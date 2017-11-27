class DiyAuthState extends
    DiyMixinFirebaseUsername(DiyMixinRedux((Polymer.Element))) {
  static get is() {
    return 'diy-auth-state';
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
    let onUserDocChangedFn = (doc) => {
      let userDetails = { name: '' };
      if (doc && doc.exists) {
        userDetails = Object.assign(userDetails, doc.data());
      }
      console.log('user record changed', doc);
      this.dispatch('userDetails', userDetails);
    };
    this.$.firebaseStore.onUserDocChanged(firebaseUser.uid, onUserDocChangedFn);

    // Check if the user has admin permissions. Admins get additional UI.
    this.$.firebaseStore.getUserAdminDoc(firebaseUser.uid)
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
    const newName = this.$.displayNameInput.value;
    if (!newName) {
      this.$.displayNameInput.setError('The name must not be empty');
      return;
    }
    if (newName.length < 3) {
      this.$.displayNameInput.setError('A name has at least 3 characters');
      return;
    }
    if (newName.length > 30) {
      this.$.displayNameInput.setError('A name has at most 30 characters');
      return;
    }

    // Persist the user's display name to the database. The Firestore real-time
    // updates will update the username in the Redux store automatically.
    this.$.setDisplayNameButton.disabled = true;
    const firebaseUser = this.getState().user.auth.firebaseUser;
    const userId = firebaseUser.uid;
    const oldName = this.getState().user.details.name;
    this.changeUsername(userId, newName, oldName)
        .then(() => {
          this.$.setDisplayNameButton.disabled = false;
          this.$.enterDisplayNameDialog.close();
        })
        .catch((errorMessage) => {
          this.$.setDisplayNameButton.disabled = false;
          this.$.displayNameInput.setError(errorMessage);
        });
  }
}

customElements.define(DiyAuthState.is, DiyAuthState);

