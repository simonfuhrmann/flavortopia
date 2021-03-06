/**
 * A datasource for Firebase requests.
 *
 * Usage:
 *   <diy-firebase-get
 *       data="{{data}}"
 *       loading="{{isLoading}}"
 *       error="{{errorMessage}}">
 *   </div-firebase-get>
 */
class DiyFirebaseGet extends DiyMixinFirebase(Polymer.Element) {
  static get is() {
    return 'diy-firebase-get';
  }

  static get properties() {
    return {
      loading: {
        type: Boolean,
        value: false,
        notify: true,
      },
      error: {
        type: String,
        value: undefined,
        notify: true,
      },
      data: {
        type: Object,
        value: () => {},
        notify: true,
      },
      listener: {
        type: Function,
        value: undefined,
      },
    };
  }

  constructor() {
    super();
    this.store = this.getFirebaseFirestore();
  }

  disconnectedCallback() {
    this.unsubscribe_();
  }

  loadUserRecipes(uid) {
    const recipesRef = this.store.collection('recipes');
    this.firebaseGetMulti_(() => recipesRef
        .where('user', '==', uid)
        .orderBy('created', 'desc'));
  }

  subscribeUserRecipes(uid) {
    const recipesRef = this.store.collection('recipes');
    this.firebaseSubscribeMulti_(() => recipesRef
        .where('user', '==', uid)
        .orderBy('created', 'desc'));
  }

  subscribeSingleRecipe(recipeKey) {
    const recipesRef = this.store.collection('recipes');
    this.firebaseSubscribeSingle_(() => recipesRef.doc(recipeKey));
  }

  subscribeRecipeComments(recipeKey) {
    const commentsRef = this.store.collection('recipes').doc(recipeKey)
        .collection('comments');
    this.firebaseSubscribeMulti_(() => commentsRef);
  }

  loadUserInventory(uid) {
    const inventoryRef = this.store.collection('inventory');
    this.firebaseGetSingle_(() => inventoryRef.doc(uid));
  }

  // For single document queries.
  // The document ID is stored in the objects 'key' field.
  // The argument is a function that returns a single document.
  firebaseGetSingle_(func) {
    this.set('loading', true);
    this.set('error', undefined);
    func().get()
        .then(doc => {
          this.set('loading', false);
          const docData = doc && doc.exists ? doc.data() : {};
          docData.key = doc.id;
          this.set('data', docData);
        })
        .catch(error => {
          this.set('loading', false);
          this.setError_(error);
        })
  }

  // For multiple-document queries, the snapshot contains an array of docs for
  // convenience. The database doc ID is stored in the objects 'key' field.
  // The argument is a function that returns a multiple document snapshot.
  firebaseGetMulti_(func) {
    this.set('loading', true);
    this.set('error', undefined);
    func().get()
        .then(snapshot => {
          this.set('loading', false);
          let docs = [];
          if (snapshot) {
            docs = snapshot.docs || [];
          }
          this.set('data', docs.map(doc => {
            const docData = doc.data();
            docData.key = doc.id;
            return docData;
          }));
        })
        .catch(error => {
          this.set('loading', false);
          this.setError_(error);
        });
  }

  // Real-time update subscription for multi-document queries.
  // Only one subscription per element can be active.
  firebaseSubscribeMulti_(func) {
    this.unsubscribe_();
    this.set('loading', true);
    this.set('error', undefined);

    const listenerOptions = {
      includeQueryMetadataChanges: true,
      includeDocumentMetadataChanges: true
    };
    this.listener = func().onSnapshot(
        listenerOptions,
        this.onSubscribeMultiUpdate_.bind(this),
        this.onSubscribeError_.bind(this));
  }

  firebaseSubscribeSingle_(func) {
    this.unsubscribe_();
    this.set('loading', true);
    this.set('error', undefined);
    this.listener = func().onSnapshot(
      this.onSubscribeSingleUpdate_.bind(this),
      this.onSubscribeError_.bind(this));
  }

  onSubscribeSingleUpdate_(doc) {
    this.set('loading', false);
    if (!doc || !doc.exists) {
      this.onSubscribeError_({message: 'Document does not exist'});
      return;
    }
    const docData = doc.data();
    docData.key = doc.id;
    this.set('data', docData);
  }

  onSubscribeMultiUpdate_(snapshot) {
    this.set('loading', false);
    let needsSorting = false;

    if (snapshot.docChanges.length == 0) {
      this.set('data', this.data || []);
      return;
    }

    // There are two options. Modify the original data and notify the splices
    // later. This is more efficient, and dom-repeat will notice the changes,
    // however, simple property observers and bindings to the data will not.
    // The other option is to make a copy of the data array, modify the copy
    // and assign later. The latter is implemented here.
    const newData = this.data ? this.data.slice() : [];
    snapshot.docChanges.forEach(change => {
      // Ignore real-time updates that do not originate from the server.
      if (change.doc.metadata.hasPendingWrites) {
        return;
      }

      // Add the document ID to the document itself.
      const docData = change.doc.data();
      docData.key = change.doc.id;

      // Process the type of change.
      switch (change.type) {
        case 'added': {
          newData.push(docData);
          needsSorting = true;
          break;
        }

        case 'modified': {
          const index = newData.findIndex(value => value.key == docData.key);
          if (index < 0) {
            newData.push(docData);
            needsSorting = true;
          } else {
            newData.splice(index, 1, docData);
          }
          break;
        }

        case 'removed': {
          const index = newData.findIndex(value => value.key == docData.key);
          if (index >= 0) {
            newData.splice(index, 1);
          }
          break;
        }

        default: {
          console.warn('Invalid change type: ' + change.type);
        }
      }
    });

    // Sort the array if necessary.
    // TODO: Make this configurable once needed.
    if (needsSorting) {
      newData.sort((lhs, rhs) => rhs.created - lhs.created);
    }

    // Notify Polymer about the changes.
    this.set('data', newData);
  }

  onSubscribeError_(error) {
    this.set('loading', false);
    this.listener = undefined;
    this.setError_(error);
  }

  unsubscribe_() {
    if (this.listener) {
      this.listener();
      this.listener = undefined;
    }
  }

  setError_(error) {
    if (error && error.message) {
      this.set('error', error.message);
    } else if (error) {
      this.set('error', error);
    } else {
      this.set('error', 'Unknown error');
    }
  }
}

customElements.define(DiyFirebaseGet.is, DiyFirebaseGet);
