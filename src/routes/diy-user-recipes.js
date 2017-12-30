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

  openEditor_(recipe) {
    this.$.recipeList.setAttribute('hidden', true);
    this.$.recipeEditor.open(recipe);
    this.$.recipeEditor.removeAttribute('hidden');
  }

  closeEditor_() {
    this.$.recipeEditor.setAttribute('hidden', true);
    this.$.recipeList.removeAttribute('hidden');
  }

  onUserIdChanged_(uid) {
    this.set('userRecipes', undefined);
    if (!uid) {
      return;
    }
  }

  onEditRecipe_(event) {
    const recipe = event.detail;
    this.openEditor_(recipe);
  }

  onCreateRecipe_(event) {
    this.openEditor_();
  }
}

customElements.define(DiyUserRecipes.is, DiyUserRecipes);
