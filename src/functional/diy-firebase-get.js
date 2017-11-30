/**
 * A datasource for Firebase requests.
 *
 * Usage:
 *   <diy-firebase-get data="{{data}}"
 *       loading="{{isLoading}}" error="{{errorMessage}}">
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
    };
  }

  constructor() {
    super();
    this.store = this.getFirebaseFirestore();
  }

  // For multiple-document queries, the snapshot contains an array of docs,
  // which is mapped to an array of the document's data for convenience.
  // The argument is a function that returns a multiple document snapshot.
  firebaseGetMulti(func) {
    this.set('loading', true);
    this.set('error', undefined);
    func()
        .then(snapshot => {
          this.set('loading', false);
          let docs = [];
          if (snapshot) {
            docs = snapshot.docs || [];
          }
          this.set('data', docs.map(doc => doc.data()));
        })
        .catch(error => {
          this.set('loading', false);
          if (error && error.message) {
            this.set('error', error.message);
          } else {
            this.set('error', 'Unknown error');
          }
        });
  }

  loadUserRecipes(uid) {
    const recipesRef = this.store.collection('recipes');
    this.firebaseGetMulti(() => recipesRef.where('user', '==', uid).get());
  }
}

customElements.define(DiyFirebaseGet.is, DiyFirebaseGet);
