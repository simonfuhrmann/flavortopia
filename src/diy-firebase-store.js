class DiyFirebaseStore extends DiyMixinFirebase(Polymer.Element) {
  static get is() {
    return 'diy-firebase-store';
  }

  static get properties() {
    return {
      store: Object,
    };
  }

  connectedCallback() {
    this.store = this.getFirebaseFirestore();
  }

  getUserDetails(uid) {
    const userRef = this.store.collection('users').doc(uid);
    return userRef.get();
  }

  setUserDetails(uid, email, name) {
    const userRecord = {
      private: { email },
      public: { name },
    };
    const userRef = this.store.collection('users').doc(uid);
    return userRef.set(userRecord);
  }

  getUserAdminRecord(uid) {
    const adminRef = this.store.collection('admins').doc(uid);
    return adminRef.get();
  }

  // loadFlavors() {
  //   this.initialize();
  //   // Load all flavors and update redux store.
  //   const flavorsRef = firebaseGlobal.database.ref('flavors/');
  //   return flavorsRef.once('value');
  // }

  // loadVendors() {
  //   this.initialize();
  //   const vendorsRef = firebaseGlobal.database.ref('vendors/');
  //   return vendorsRef.once('value');
  // }
}

customElements.define(DiyFirebaseStore.is, DiyFirebaseStore);
