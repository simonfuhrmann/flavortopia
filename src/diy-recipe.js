class DiyRecipe extends DiyMixinStaticData(DiyMixinRedux(Polymer.Element)) {
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

      ingredients: Array,
      hasIngredients: Boolean,
      hasRecipeNotes: Boolean,
    };
  }

  onRecipeChanged_(recipe) {
    this.set('recipeTimestamp', this.timestampToString_(recipe.created));
    this.set('ingredients', this.mapIngredients_(recipe.ingredients));
    this.set('hasIngredients', this.ingredients.length > 0);
    this.set('hasDescription', recipe.description && recipe.description.length > 0);
  }

  /** Returns a YYYY-MM-DD date representation from a timestamp. */
  timestampToString_(timestamp) {
    if (!timestamp) {
      return '(unavailable)';
    }
    let date = new Date(timestamp);
    let dateString = date.toISOString();
    let endIndex = dateString.indexOf('T');
    return dateString.substring(0, endIndex);
  }

  /** Maps the recipe ingredients to values for display. */
  mapIngredients_(ingredients) {
    if (!ingredients) return [];
    return Object.keys(ingredients).map(flavorKey => {
      const flavor = this.flavorForKey(flavorKey);
      const vendor = this.vendorForKey(flavor.vendor);
      const percent = this.formatPercent_(ingredients[flavorKey]);
      return { flavor, vendor, percent };
    });
  }

  isAuthenticated_(authUserId, recipeUserId) {
    return authUserId == recipeUserId;
  }

  formatPercent_(value) {
    return Number(value).toFixed(2);
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

  onMixTap_() {
  }

  onDeleteTap_() {
  }
}

customElements.define(DiyRecipe.is, DiyRecipe);
