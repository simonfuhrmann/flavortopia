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

  getUserDoc(uid) {
    const userRef = this.store.collection('users').doc(uid);
    return userRef.get();
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

  getRecipes(limit, search, startAt) {
    let recipesRef = this.store.collection('recipes');
    if (limit) {
      recipesRef = recipesRef.limit(limit);
    }
    if (search) {
      recipesRef = recipesRef.where('name', '>=', search);
      //recipesRef = recipesRef.where('name', '<=', search);
    }
    if (startAt) {
      recipesRef = recipesRef.startAt(startAt);
    }
    return recipesRef.get();
  }

  onInventoryChanged(uid, func) {
    const userInventory = this.store.collection('inventory').doc(uid);
    return userInventory.onSnapshot(func);
  }

  setInventory(uid, inventory) {
    const inventoryRef = this.store.collection('inventory').doc(uid);
    return inventoryRef.set(inventory);
  }

  setRecipe(recipe) {
    // Add a timestamp field to the recipe.
    const recipeCopy = Object.assign({}, recipe);
    recipeCopy.created = firebase.firestore.FieldValue.serverTimestamp();

    // If the recipe contains a 'key', delete the key and overwrite the record
    // in the DB. Otherwise create a new recipe record.
    const recipesRef = this.store.collection('recipes');
    if (recipeCopy.key) {
      const documentKey = recipeCopy.key;
      delete recipeCopy.key;
      return recipesRef.doc(documentKey).set(recipeCopy);
    } else {
      return recipesRef.add(recipeCopy);
    }
  }

  deleteRecipe(recipeKey) {
    const recipesRef = this.store.collection('recipes').doc(recipeKey);
    return recipesRef.delete();
  }
}

customElements.define(DiyFirebaseStore.is, DiyFirebaseStore);
