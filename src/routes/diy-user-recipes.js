class DiyUserRecipes extends DiyMixinRedux(Polymer.Element) {
  static get is() {
    return 'diy-user-recipes';
  }

  static get properties() {
    return {
      isLoading: {
        type: Boolean,
        value: true,
      },
      loadingError: String,
      userRecipes: Array,
      userId: {
        type: String,
        statePath: 'user.auth.firebaseUser.uid',
        observer: 'onUserIdChanged_',
      },
    };
  }

  onUserIdChanged_(uid) {
    this.set('userRecipes', undefined);
    this.$.firebaseGet.loadUserRecipes(uid);
  }

  showNoRecipes_(userRecipes) {
    return userRecipes && userRecipes.length == 0;
  }

  onSaveTap_() {
  }
}

customElements.define(DiyUserRecipes.is, DiyUserRecipes);
