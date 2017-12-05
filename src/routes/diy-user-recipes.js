class DiyUserRecipes extends DiyMixinRedux(Polymer.Element) {
  static get is() {
    return 'diy-user-recipes';
  }

  static get properties() {
    return {
      userId: {
        type: String,
        statePath: 'user.auth.firebaseUser.uid',
        observer: 'onUserIdChanged_',
      },
    };
  }

  onUserIdChanged_(uid) {
    this.set('userRecipes', undefined);
    if (!uid) {
      return;
    }
  }
}

customElements.define(DiyUserRecipes.is, DiyUserRecipes);
