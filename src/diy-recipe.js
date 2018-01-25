class DiyRecipe extends DiyMixinCommon(DiyMixinStaticData(Polymer.Element)) {
  static get is() {
    return 'diy-recipe';
  }

  static get properties() {
    return {
      /** The authenticated user's ID. */
      authUserId: {
        type: String,
        value: null,
      },

      /** The recipe database object. */
      recipe: {
        type: Object,
        observer: 'onRecipeChanged_',
      },

      /** A more compact recipe view. */
      compact: {
        type: Boolean,
        value: false,
      },

      // The following properties are assigned when a recipe is set.

      /** Recipe author user name. */
      recipeAuthor: String,
      /** Formatted recipe timestamp. */
      recipeTimestamp: String,
      /** Ingredients prepared for display. */
      ingredients: Array,
      hasIngredients: Boolean,
      hasDescription: Boolean,
      hasRecipeNotes: Boolean,
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
    this.set('hasRecipeNotes', !!recipe.notes);
  }

  /** Maps the recipe ingredients to values for display. */
  mapIngredients_(ingredients) {
    if (!ingredients) return [];
    return ingredients.map(ingredient => {
      const flavor = this.flavorForKey(ingredient.flavor);
      const vendor = this.vendorForKey(flavor.vendor);
      const percent = ingredient.percent;
      return { flavor, vendor, percent };
    });
  }

  totalFlavoring_(ingredients) {
    const totalPercent = ingredients.reduce((prev, curr) => {
      return prev + curr.percent;
    }, 0.0);
    return this.formatFixed(totalPercent);
  }

  isAuthenticated_(authUserId, recipeUserId) {
    return authUserId == recipeUserId;
  }

  onVendorTap_(event) {
    const vendor = event.model.item.vendor;
    this.$.vendorPopup.set('positionTarget', event.path[0]);
    this.$.vendorPopup.set('key', vendor.key);
    this.$.vendorPopup.open();
  }

  onActionTap_(event) {
    const flavor = event.model.item.flavor;
    if (!flavor || !flavor.key) return;
    this.$.flavorActions.set('positionTarget', event.path[0]);
    this.$.flavorActions.set('flavor', flavor.key);
    this.$.flavorActions.open();
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
