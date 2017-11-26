class DiyFirebaseStore extends DiyMixinFirebase(Polymer.Element) {
  static get is() {
    return 'diy-firebase-store';
  }

  static get properties() {
    return {
      store: Object,
    };
  }

  constructor() {
    super();
    this.store = this.getFirebaseFirestore();
  }

  onUserDocChanged(uid, func) {
    const userRef = this.store.collection('users').doc(uid);
    userRef.onSnapshot(func);
  }

  setUserName(uid, name) {
    const userRecord = { name };
    const userRef = this.store.collection('users').doc(uid);
    return userRef.set(userRecord);
  }

  getUserAdminDoc(uid) {
    const adminRef = this.store.collection('admins').doc(uid);
    return adminRef.get();
  }

  getRecipes(uid) {
    const recipesRef = this.store.collection('recipes');
    return recipesRef.where('user', '==', uid).get();
  }

  getFlavors() {
    const flavorsRef = this.store.collection('flavors');
    return flavorsRef.get();
  }

  getVendors() {
    const vendorsRef = this.store.collection('vendors');
    return vendorsRef.get();
  }
}

customElements.define(DiyFirebaseStore.is, DiyFirebaseStore);
