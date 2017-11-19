class DiyUserAction extends DiyMixinRouter(Polymer.Element) {
  static get is() {
    return 'diy-user-action';
  }

  static get properties() {
    return {
      errorDialogTitle: String,
      errorDialogMessage: String,
    };
  }

  static get observers() {
    return [
      'updateRoute_(activeRoute)'
    ];
  }

  updateRoute_(activeRoute) {
    const query = activeRoute.query || { mode: '' };
    this.$.lostPasswordCard.setAttribute('hidden', true);
    this.$.resetCodeSentCard.setAttribute('hidden', true);
    this.$.resetPasswordCard.setAttribute('hidden', true);
    this.$.resetCompleteCard.setAttribute('hidden', true);
    switch (query.mode) {
      case 'lostPassword':
        this.$.lostPasswordCard.removeAttribute('hidden');
        this.focusInput_(this.$.passwordResetEmailInput);
        break;
      case 'resetCodeSent':
        this.$.resetCodeSentCard.removeAttribute('hidden');
        break;
      case 'resetPassword':
        this.$.resetPasswordCard.removeAttribute('hidden');
        this.focusInput_(this.$.passwordResetPasswordInput);
        break;
      case 'resetComplete':
        this.$.resetCompleteCard.removeAttribute('hidden');
        break;
      default:
        if (activeRoute.isUserActionActive) {
          this.goHome();
        }
        return;
    }
  }

  passwordResetSendEmailTap_() {
    this.$.passwordResetSendEmailButton.disabled = true;
    const email = this.$.passwordResetEmailInput.value;
    if (!email) {
      this.$.errorDialog.openError(
          'Invalid Email Address',
          'Please provide a valid email address.');
      return;
    }

    this.$.firebaseAuth.sendPasswordResetEmail(email)
        .catch((error) => {
          this.$.passwordResetSendEmailButton.disabled = false;
          this.$.errorDialog.openError('Error Sending Code', error.message);
          throw error;
        })
        .then((data) => {
          this.$.passwordResetSendEmailButton.disabled = false;
          this.goUserAction('resetCodeSent');
        });
  }

  passwordResetEnterCodeTap_() {
    this.goUserAction('resetPassword');
  }

  passwordResetSubmitCodeTap_() {
    this.$.passwordResetSubmitCodeButton.disabled = true;
    const code = this.$.passwordResetCodeInput.value;
    const pass1 = this.$.passwordResetPasswordInput.value;
    const pass2 = this.$.passwordResetPasswordInputRepeat.value;
    if (pass1 != pass2) {
      this.$.errorDialog.openError(
          'Password Error',
          'The passwords do not match.');
      return;
    }
    if (!pass1) {
      this.$.errorDialog.openError(
          'Password Error',
          'Please enter a valid password.');
      return;
    }

    this.$.firebaseAuth.confirmPasswordReset(code, pass1)
        .then((data) => {
          this.$.passwordResetSubmitCodeButton.disabled = false;
          this.goUserAction('resetComplete');
          return data;
        })
        .catch((error) => {
          this.$.passwordResetSubmitCodeButton.disabled = false;
          this.$.errorDialog.openError('Password Reset Error', error.message);
          throw error;
        });
  }

  passwordResetSigninTap_() {
    this.goUserSignin();
  }

  focusInput_(element) {
    setTimeout(() => { element.focus(); }, 250);
  }
}

customElements.define(DiyUserAction.is, DiyUserAction);
