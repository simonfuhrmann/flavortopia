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
      filter: String,
      loadingError: String,
      deleteRecipe: Object,
      userRecipes: Array,
      filteredRecipes: Array,
    };
  }

  static get observers() {
    return [
      'applyFilter_(filter, userRecipes.*)',
    ];
  }

  onUserIdChanged_(userId) {
    this.set('userRecipes', undefined);
    if (!userId) {
      return;
    }
    this.$.firebaseGet.subscribeUserRecipes(userId);
  }

  applyFilter_(filter) {
    if (!filter || filter.length < 3) {
      this.set('filteredRecipes', this.userRecipes);
      return;
    }

    const filterLc = filter.toLowerCase();
    this.set('filteredRecipes', this.userRecipes.filter(recipe => {
      return recipe.name.toLowerCase().includes(filterLc);
    }));
  }

  showNoRecipes_(userRecipes) {
    return !userRecipes || userRecipes.length == 0;
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
