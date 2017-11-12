class DiyApp extends DiyMixinRouter(DiyMixinRedux((Polymer.Element))) {
  static get is() {
    return 'diy-app';
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

  onUserDetailsChanged_(userDetails) {
    // Open a dialog if the user does not have a display name set.
    if (userDetails && userDetails.name === '') {
      this.$.enterDisplayNameDialog.open();
    } else {
      console.log('no need to enter user display name', userDetails);
    }
  }

  onSetDisplayNameTap_() {
    // Get the display name from the input field.
    this.$.displayNameInput.setError('');
    const displayName = this.$.displayNameInput.value;
    if (!displayName) {
      this.$.displayNameInput.setError('Name must not be empty!');
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
          console.log('error', error);
          this.$.displayNameInput.setError('Name must be at least 3 letters');
          throw error;
        });
  }

  writeUserDetails_() {
  }
}

customElements.define(DiyApp.is, DiyApp);
