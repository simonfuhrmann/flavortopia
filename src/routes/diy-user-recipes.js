class DiyUserRecipes extends DiyMixinRedux(Polymer.Element) {
  static get is() {
    return 'diy-user-recipes';
  }

  static get properties() {
    return {
      userRecipes: Array,
      //lastVisible: Object,
      testvalue: {
        type: String,
        observer: 'onValueChanged_',
      }
    };
  }

  onSaveTap_() {
    const uid = this.getState().user.auth.firebaseUser.uid;
    console.log('uid', uid);
    this.$.firebaseStore.getUserRecipes(uid)
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
