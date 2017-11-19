class DiyWelcome extends DiyMixinRedux(Polymer.Element) {
  static get is() {
    return 'diy-welcome';
  }
  static get properties() {
    return {
      welcomeMessage: String,
      userDetails: {
        type: Object,
        statePath: 'user.auth',
        observer: 'onUserAuthChanged_',
      },
    };
  }

  ready() {
    super.ready();
    this.onUserAuthChanged_();
  }

  onUserAuthChanged_(userAuth) {
    const message = 'Welcome to Flavortopia!';
    if (!userAuth || !userAuth.signedIn) {
      this.set('welcomeMessage', message);
      return;
    }

    const user = userAuth.firebaseUser;
    if (!user.displayName) {
      this.set('welcomeMessage', message);
      return;
    }

    this.set('welcomeMessage', 'Welcome, ' + user.displayName + '!');
  }
}

customElements.define(DiyWelcome.is, DiyWelcome);
