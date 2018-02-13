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
    const config = {
      apiKey: "AIzaSyAGujTcfguPXVRJM0Xvvio_NwZa35Ho8B4",
      authDomain: "shake-and-vape.firebaseapp.com",
      databaseURL: "https://shake-and-vape.firebaseio.com",
      projectId: "shake-and-vape",
    };
    firebase.initializeApp(config);

    // Initialize auth module and Cloud Firestore.
    firebaseGlobal = {
      auth: firebase.auth(),
      firestore: firebase.firestore(),
    };
  }
};
