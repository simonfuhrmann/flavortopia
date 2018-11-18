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

  getRecipes(limit, startAt, user) {
    let recipesRef = this.store.collection('recipes')
        .orderBy('created', 'desc')
        .where('isPublic', '==', true);
    if (limit) {
      recipesRef = recipesRef.limit(limit);
    }
    if (user) {
      recipesRef = recipesRef.where('user', '==', user);
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
    // Make copy to add timestamp and remove recipe key.
    const recipeCopy = Object.assign({}, recipe);

    // If the recipe contains a 'key', delete the key from the recipe and
    // overwrite the record in the DB. Otherwise create a new recipe record,
    // and set the created timestamp value.
    const recipesRef = this.store.collection('recipes');
    if (recipeCopy.key) {
      const documentKey = recipeCopy.key;
      delete recipeCopy.key;
      return recipesRef.doc(documentKey).set(recipeCopy);
    } else {
      recipeCopy.created = firebase.firestore.FieldValue.serverTimestamp();
      return recipesRef.add(recipeCopy);
    }
  }

  deleteRecipe(recipeKey) {
    const recipesRef = this.store.collection('recipes').doc(recipeKey);
    return recipesRef.delete();
  }

  setComment(uid, recipeKey, comment) {
    // Make a copy to add timestamp and remove comment key.
    const commentCopy = Object.assign({}, comment);

    // See comment for setRecipe.
    const commentRef =
        this.store.collection('recipes').doc(recipeKey).collection('comments');
    if (commentCopy.key) {
      const commentKey = commentCopy.key;
      delete commentCopy.key;
      return commentRef.doc(uid).set(commentCopy);
    } else {
      commentCopy.created = firebase.firestore.FieldValue.serverTimestamp();
      return commentRef.doc(uid).set(commentCopy);
    }
  }

  deleteComment(uid, recipeKey) {
    const commentRef = this.store.collection('recipes').doc(recipeKey)
        .collection('comments').doc(uid);
    return commentRef.delete();
  }
}

customElements.define(DiyFirebaseStore.is, DiyFirebaseStore);
