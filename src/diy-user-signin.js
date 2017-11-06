class DiyUserSignin extends DiyMixinRouter(DiyMixinRedux(Polymer.Element)) {
  static get is() {
    return 'diy-user-signin';
  }

  static get properties() {
    return {
      errorMessage: String,
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
  }

  userSigninTap_() {
    // Get email/password from input elements.
    const email = this.$.signinEmailInput.value;
    const pass = this.$.signinPasswordInput.value;
    if (!email || !pass) {
      this.set('errorMessage', 'E-Mail and/or password is invalid.');
      this.$.errorDialog.open();
      return;
    }
    // Authenticate credentials using Firebase.
    this.$.signupButton.disabled = true;
    this.$.signinButton.disabled = true;
    this.$.firebase.authSigninEmailPassword(email, pass)
        .catch(error => {
          this.$.signupButton.disabled = false;
          this.$.signinButton.disabled = false;
          this.set('errorMessage', error.message);
          this.$.errorDialog.open();
          throw error;
        })
        .then(data => {
          // If sign-up was successful, return to home.
          this.$.signupButton.disabled = false;
          this.$.signinButton.disabled = false;
          this.goHome();
          return data;
        });
  }

  userSignupTap_() {
    // Get email/password from input elements.
    const email = this.$.signupEmailInput.value;
    const pass1 = this.$.signupPasswordInput.value;
    const pass2 = this.$.signupPasswordRepeatInput.value;
    if (!email || !pass1 || !pass2) {
      this.set('errorMessage', 'E-Mail and/or password is invalid.');
      this.$.errorDialog.open();
      return;
    }
    if (pass1 != pass2) {
      this.set('errorMessage', 'The passwords to not match.');
      this.$.errorDialog.open();
      return;
    }
    // Authenticate credentials using Firebase.
    this.$.signupButton.disabled = true;
    this.$.signinButton.disabled = true;
    this.$.firebase.authSignupEmailPassword(email, pass1)
        .catch(error => {
          this.$.signupButton.disabled = false;
          this.$.signinButton.disabled = false;
          this.set('errorMessage', error.message);
          this.$.errorDialog.open();
          throw error;
        })
        .then(data => {
          // If sign-up was successful, return to home.
          this.$.signupButton.disabled = false;
          this.$.signinButton.disabled = false;
          this.goHome();
          return data;
        });
  }
}

customElements.define(DiyUserSignin.is, DiyUserSignin);
