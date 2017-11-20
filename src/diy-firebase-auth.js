class DiyFirebaseAuth extends DiyMixinFirebase(Polymer.Element) {
  static get is() {
    return 'diy-firebase-auth';
  }

  static get properties() {
    return {
      auth: Object,
    };
  }

  constructor() {
    super();
    this.auth = this.getFirebaseAuth();
  }

  setupAuthStateHandler(handler) {
    this.auth.onAuthStateChanged(handler);
  }

  signinEmailPassword(email, pass) {
    return this.auth.signInWithEmailAndPassword(email, pass);
  }

  signupEmailPassword(email, pass) {
    return this.auth.createUserWithEmailAndPassword(email, pass);
  }

  sendPasswordResetEmail(email) {
    return this.auth.sendPasswordResetEmail(email);
  }

  confirmPasswordReset(code, pass) {
    return this.auth.confirmPasswordReset(code, pass);
  }

  signinWithProvider(provider) {
    return this.auth.signInWithRedirect(provider);
  }

  getRedirectResult() {
    return this.auth.getRedirectResult();
  }

  getGoogleAuthProvider() {
    return new firebase.auth.GoogleAuthProvider();
  }

  signOut() {
    this.auth.signOut();
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
}

customElements.define(DiyFirebaseAuth.is, DiyFirebaseAuth);
