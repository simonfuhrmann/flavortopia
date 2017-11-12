class DiyUserSignin extends DiyMixinRouter(DiyMixinRedux(Polymer.Element)) {
  static get is() {
    return 'diy-user-signin';
  }

  static get properties() {
    return {
      passwordResetEmail: String,
    };
  }

  static get actions() {
    return {
      userSignin(data) {
        return { type: 'USER_SIGNIN', data: data };
      }
    };
  }

  ready() {
    super.ready();
    // Focus Email input by default. Needs to be in a timeout.
    setTimeout(() => {
      this.$.signinEmailInput.focus();
    }, 0);

    // Read authentication redirect result. The promise resolves immediately
    // with a null user if no authentication request has been made. The promise
    // resolves with a real user if an authentication redirect happened, in
    // which case we want to redirect the user to the welcome page. In case of
    // errors, just let the user know.
    this.$.waitingForTokenDialog.open();
    this.$.firebase.authGetRedirectResult()
        .then(data => {
          this.$.waitingForTokenDialog.close();
        })
        .catch(error => {
          this.$.waitingForTokenDialog.close();
          this.$.errorDialog.openError('Sign-in error', error.message);
        });
  }

  userSigninTap_() {
    // Get email/password from input elements.
    const email = this.$.signinEmailInput.value;
    const pass = this.$.signinPasswordInput.value;
    if (!email || !pass) {
      this.$.errorDialog.openError(
          'Sign-in error', 'E-Mail and/or password is invalid.');
      return;
    }

    // Authenticate credentials using Firebase.
    this.$.signupButton.disabled = true;
    this.$.signinButton.disabled = true;
    this.$.firebase.authSigninEmailPassword(email, pass)
        .catch(error => {
          this.$.signupButton.disabled = false;
          this.$.signinButton.disabled = false;
          this.$.errorDialog.openError('Sign-in error', error.message);
          throw error;
        })
        .then(data => {
          // If sign-up was successful, return to home.
          this.$.signupButton.disabled = false;
          this.$.signinButton.disabled = false;
          return data;
        });
  }

  userSignupTap_() {
    // Get email/password from input elements.
    const email = this.$.signupEmailInput.value;
    const pass1 = this.$.signupPasswordInput.value;
    const pass2 = this.$.signupPasswordRepeatInput.value;
    if (!email || !pass1 || !pass2) {
      this.$.errorDialog.openError(
          'Sign-in error', 'E-Mail and/or password is invalid.');
      return;
    }
    if (pass1 != pass2) {
      this.$.errorDialog.openError(
          'Sign-in error', 'The passwords do not match.');
      return;
    }

    // Authenticate credentials using Firebase.
    this.$.signupButton.disabled = true;
    this.$.signinButton.disabled = true;
    this.$.firebase.authSignupEmailPassword(email, pass1)
        .then(data => {
          // If sign-up was successful, return to home.
          this.$.signupButton.disabled = false;
          this.$.signinButton.disabled = false;
          return data;
        })
        .catch(error => {
          this.$.signupButton.disabled = false;
          this.$.signinButton.disabled = false;
          this.$.errorDialog.openError('Sign-in error', error.message);
          throw error;
        });
  }

  resetPasswordTap_() {
    this.goUserAction('lostPassword');
  }

  signinGoogle_() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    this.$.firebase.authSigninWithProvider(provider);
  }

  signinFacebook_() {
  }

  signinGithub_() {
  }

  signinTwitter_() {
  }
}

customElements.define(DiyUserSignin.is, DiyUserSignin);
