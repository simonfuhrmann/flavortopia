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
      userSignin(data) {
        return { type: 'USER_SIGNIN', data: data };
      }
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

  authSetupStateHandler() {
    this.initialize();
    firebaseGlobal.auth.onAuthStateChanged(firebaseUser => {
      this.authStateChanged_(firebaseUser);
    });
  }

  authSigninEmailPassword(email, pass) {
    this.initialize();
    return firebaseGlobal.auth.signInWithEmailAndPassword(email, pass);
  }

  authSignupEmailPassword(email, pass) {
    this.initialize();
    return firebaseGlobal.auth.createUserWithEmailAndPassword(email, pass);
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
    this.authStateChanged_(undefined);
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

  authStateChanged_(firebaseUser) {
    if (firebaseUser) {
      // User is authenticated.
      this.dispatch('userSignin', {
        signedIn: true,
        firebaseUser: firebaseUser,
      });
    } else {
      // User is not authenticated.
      this.dispatch('userSignin', {
        signedIn: false,
        firebaseUser: undefined,
      });
    }
  }
}

customElements.define(DiyFirebase.is, DiyFirebase);
