class DiyUserRecipes extends DiyMixinRedux(Polymer.Element) {
  static get is() {
    return 'diy-user-recipes';
  }

  static get properties() {
    return {
      userRecipes: Array,
      testvalue: {
        type: String,
        observer: 'onValueChanged_',
      },
      userId: {
        type: String,
        statePath: 'user.auth.firebaseUser.uid',
        observer: 'onUserIdChanged_',
      },
    };
  }

  onUserIdChanged_(uid) {
    this.loadUserRecipes_();
  }

  onSaveTap_() {
  }

  loadUserRecipes_() {
    const uid = this.getState().user.auth.firebaseUser.uid;
    console.log('loading recipies for uid:', uid);
    this.$.firebaseStore.getRecipes(uid)
        .then(snapshot => {
          console.log('snapshot', snapshot);
          if (snapshot) {
            const userRecipes = snapshot.docs.map(doc => doc.data());
            this.set('userRecipes', userRecipes);
          }
        })
        .catch(error => {
          console.warn('Error getting recipes:', error.message);
        });
  }
}

customElements.define(DiyUserRecipes.is, DiyUserRecipes);
