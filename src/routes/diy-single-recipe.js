class DiySingleRecipe extends DiyMixinRouter(Polymer.Element) {
  static get is() {
    return 'diy-single-recipe';
  }

  static get properties() {
    return {
      isLoading: {
        type: Boolean,
        value: false,
      },
      loadingError: {
        type: String,
        value: null,
      },
      recipe: {
        type: Object,
        value: null,
      },
    };
  }

  static get observers() {
    return [
      'updateRoute_(activeRoute)',
    ];
  }

  updateRoute_(activeRoute) {
    const query = activeRoute.query || { id: '' };
    if (!query.id) {
      this.set('loadingError', 'No recipe ID given');
      return;
    }

    this.set('recipe', null);
    const recipeKey = query.id;
    this.$.firebaseGet.subscribeSingleRecipe(recipeKey);
  }
}

customElements.define(DiySingleRecipe.is, DiySingleRecipe);
