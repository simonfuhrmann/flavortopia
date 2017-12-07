class DiyRecipeList extends Polymer.Element {
  static get is() {
    return 'diy-recipe-list';
  }

  static get properties() {
    return {
      userId: {
        type: String,
        observer: 'onUserIdChanged_',
      },
      isLoading: {
        type: Boolean,
        value: false,
      },
      loadingError: String,
      userRecipes: Array,
    };
  }

  onUserIdChanged_(userId) {
    this.set('userRecipes', undefined);
    if (!userId) {
      return;
    }
    this.$.firebaseGet.loadUserRecipes(userId);
  }

  showNoRecipes_(userRecipes) {
    return userRecipes && userRecipes.length == 0;
  }

  onNewRecipeTap_() {
    this.dispatchEvent(new CustomEvent('create-recipe'));
  }

  // When editing a recipe was requested, forward the request.
  onEditRecipe_(event) {
    const detail = event.detail;
    this.dispatchEvent(new CustomEvent('edit-recipe', { detail }));
  }
}

customElements.define(DiyRecipeList.is, DiyRecipeList);
