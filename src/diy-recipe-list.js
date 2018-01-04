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
      deleteRecipe: Object,
    };
  }

  onUserIdChanged_(userId) {
    this.set('userRecipes', undefined);
    if (!userId) {
      return;
    }
    this.$.firebaseGet.subscribeUserRecipes(userId);
  }

  showNoRecipes_(userRecipes) {
    return userRecipes && userRecipes.length == 0;
  }

  onNewRecipeTap_() {
    this.dispatchEvent(new CustomEvent('create-recipe'));
  }

  onEditRecipe_(event) {
    const recipe = event.detail;
    this.dispatchEvent(new CustomEvent('edit-recipe', { detail: recipe }));
  }

  onDeleteRecipe_(event) {
    const recipe = event.detail;
    this.set('deleteRecipe', recipe);
    this.$.deleteDialog.open();
  }

  onDeleteRecipeConfirmed_() {
    this.$.firebaseStore.deleteRecipe(this.deleteRecipe.key)
        .then(() => {
          this.$.deleteDialog.close();
          this.set('deleteRecipe', undefined);
        })
        .catch(error => {
          this.$.deleteDialog.close();
          this.$.dialog.openError('Error Deleting Recipe', error.message);
        });
  }
}

customElements.define(DiyRecipeList.is, DiyRecipeList);
