let firebaseGlobal = undefined;

DiyMixinFirebase = (superClass) => class extends superClass {
  getFirebaseFirestore() {
    this.initialize_();
    return firebaseGlobal.firestore;
  }

  getFirebaseAuth() {
    this.initialize_();
    return firebaseGlobal.auth;
  }

  initialize_() {
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

    // Initialize auth module and Cloud Firestore.
    firebaseGlobal = {
      auth: firebase.auth(),
      firestore: firebase.firestore(),
    };
  }
};
