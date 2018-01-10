class DiyRecipe extends
    DiyMixinCommon(DiyMixinStaticData(DiyMixinRedux(Polymer.Element))) {
  static get is() {
    return 'diy-recipe';
  }

  static get properties() {
    return {
      /** The authenticated user's user ID. */
      authUserId: {
        type: String,
        statePath: 'user.auth.firebaseUser.uid',
      },
      /** The recipe database object. */
      recipe: {
        type: Object,
        observer: 'onRecipeChanged_',
      },
      /** Recipe author user name. */
      recipeAuthor: String,
      /** Formatted recipe timestamp. */
      recipeTimestamp: String,
      /** Ingredients prepared for display. */
      ingredients: Array,
      hasIngredients: Boolean,
      hasDescription: Boolean,
      /** Whether the recipe mixer replaces the ingredient list. */
      showRecipeMixer: {
        type: Boolean,
        value: false,
      },
    };
  }

  onRecipeChanged_(recipe) {
    this.set('recipeTimestamp', this.formatTimestamp(recipe.created));
    this.set('ingredients', this.mapIngredients_(recipe.ingredients));
    this.set('hasIngredients', this.ingredients.length > 0);
    this.set('hasDescription', !!recipe.description);
  }

  /** Maps the recipe ingredients to values for display. */
  mapIngredients_(ingredients) {
    if (!ingredients) return [];
    return Object.keys(ingredients).map(flavorKey => {
      const flavor = this.flavorForKey(flavorKey);
      const vendor = this.vendorForKey(flavor.vendor);
      const percent = ingredients[flavorKey];
      return { flavor, vendor, percent };
    });
  }

  isAuthenticated_(authUserId, recipeUserId) {
    return authUserId == recipeUserId;
  }

  onVendorTap_(event) {
    const ingredient = event.model.item;
    this.$.vendorPopup.set('positionTarget', event.path[0]);
    this.$.vendorPopup.set('key', ingredient.vendor.key);
    this.$.vendorPopup.open();
  }

  onEditTap_() {
    const detail = { detail: this.recipe };
    this.dispatchEvent(new CustomEvent('edit-recipe', detail));
  }

  onToggleMixer_() {
    this.set('showRecipeMixer', !this.showRecipeMixer);
  }

  onDeleteTap_() {
    const detail = { detail: this.recipe };
    this.dispatchEvent(new CustomEvent('delete-recipe', detail));
  }
}

customElements.define(DiyRecipe.is, DiyRecipe);
