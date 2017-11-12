let firebaseGlobal = undefined;

class DiyFirebase extends DiyMixinRedux(Polymer.Element) {
  static get is() {
    return 'diy-firebase';
  }

  static get actions() {
    return {
      initFlavors(data) {
        return { type: 'INIT_FLAVORS', data: data };
      },
      initVendors(data) {
        return { type: 'INIT_VENDORS', data: data };
      },
    };
  }

  initialize() {
    if (firebaseGlobal) {
      return;
    }

    // Initialize Firebase app.
    var config = {
      apiKey: "AIzaSyAHEzmqB5011Wy_1GL5JgNNFOKGd6jATA4",
      authDomain: "flavortopia.firebaseapp.com",
      databaseURL: "https://flavortopia.firebaseio.com",
      projectId: "flavortopia",
    };
    firebase.initializeApp(config);

    // Initialize Firebase database and auth module.
    firebaseGlobal = {
      database: firebase.database(),
      auth: firebase.auth(),
    };
  }

  authSetupStateHandler(handler) {
    this.initialize();
    firebaseGlobal.auth.onAuthStateChanged(handler);
  }

  authSigninEmailPassword(email, pass) {
    this.initialize();
    return firebaseGlobal.auth.signInWithEmailAndPassword(email, pass);
  }

  authSignupEmailPassword(email, pass) {
    this.initialize();
    return firebaseGlobal.auth.createUserWithEmailAndPassword(email, pass);
  }

  authSendPasswordResetEmail(email) {
    this.initialize();
    return firebaseGlobal.auth.sendPasswordResetEmail(email);
  }

  authConfirmPasswordReset(code, pass) {
    this.initialize();
    return firebaseGlobal.auth.confirmPasswordReset(code, pass);
  }

  authSigninWithProvider(provider) {
    this.initialize();
    return firebaseGlobal.auth.signInWithRedirect(provider);
  }

  authGetRedirectResult() {
    this.initialize();
    return firebaseGlobal.auth.getRedirectResult();
  }

  authSignOut() {
    this.initialize();
    firebaseGlobal.auth.signOut();
  }

  loadUserDetails(uid) {
    this.initialize();
    const userRef = firebaseGlobal.database.ref('users/' + uid);
    return userRef.once('value');
  }

  writeUserDetails(uid, email, name) {
    this.initialize();
    const userRef = firebaseGlobal.database.ref('users/' + uid);
    return userRef.set({ name, email });
  }

  // TODO: error handling
  loadFlavorsAndVendors() {
    this.initialize();
    // Load all flavors and update redux store.
    const flavorsRef = firebaseGlobal.database.ref('flavors/');
    flavorsRef.on('value', function(snapshot) {
      this.dispatch('initFlavors', snapshot.val());
      flavorsRef.off();
    }.bind(this));

    // Load all vendors and update redux store.
    const vendorsRef = firebaseGlobal.database.ref('vendors/');
    vendorsRef.on('value', function(snapshot) {
      this.dispatch('initVendors', snapshot.val());
      vendorsRef.off();
    }.bind(this));
  }
}

customElements.define(DiyFirebase.is, DiyFirebase);
