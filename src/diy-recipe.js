class DiyRecipe extends DiyMixinStaticData(DiyMixinRedux(Polymer.Element)) {
  static get is() {
    return 'diy-recipe';
  }

  static get properties() {
    return {
      authUserId: {
        type: String,
        statePath: 'user.auth.firebaseUser.uid',
      },
      recipe: {
        type: Object,
        observer: 'onRecipeChanged_',
      },
      recipeKey: String,
      recipeName: String,
      recipeUserId: String,
      recipeAuthor: String,
      recipeDescription: String,
      recipePublicNotes: String,
      recipePersonalNotes: String,
      recipeCreated: String,
      ingredients: Array,
      hasIngredients: Boolean,
      hasRecipeNotes: Boolean,
    };
  }

  onRecipeChanged_(recipe) {
    this.set('recipeKey', recipe.key);
    this.set('recipeName', recipe.name);
    this.set('recipeUserId', recipe.user);
    this.set('recipeDescription', recipe.description || '');
    this.set('recipePublicNotes', recipe.publicNotes || '');
    this.set('recipePersonalNotes', recipe.personalNotes || '');
    this.set('recipeCreated', this.timestampToString_(recipe.created));
    this.set('ingredients', this.mapIngredients_(recipe.ingredients));
    this.set('hasIngredients', this.ingredients.length > 0);
    this.set('hasDescription', this.recipeDescription.length > 0);
  }

  // Returns a YYYY-MM-DD date representation from a timestamp.
  timestampToString_(timestamp) {
    if (!timestamp) {
      return '(unavailable)';
    }
    let date = new Date(timestamp);
    let dateString = date.toISOString();
    let endIndex = dateString.indexOf('T');
    return dateString.substring(0, endIndex);
  }

  mapIngredients_(ingredients) {
    if (!ingredients) return [];
    const array = [];
    Object.keys(ingredients).forEach(flavorKey => {
      const ingredient = this.ingredientFromKey_(flavorKey);
      ingredient.percent = this.formatPercent_(ingredients[flavorKey]);
      array.push(ingredient);
    });
    return array;
  }

  ingredientFromKey_(flavorKey) {
    const flavorData = this.allFlavors[flavorKey];
    if (!flavorData) {
      return { vendor: 'n/a', flavor: flavorKey };
    }
    return {
      vendor: flavorData.vendor || 'n/a',
      flavor: flavorData.name || flavorKey,
    };
  }

  vendorFromKey_(vendorKey) {
    const vendor = this.allVendors[vendorKey];
    return vendor ? vendor.short : vendorKey;
  }

  isAuthenticated_(authUserId, recipeUserId) {
    return authUserId == recipeUserId;
  }

  formatPercent_(value) {
    return Number(value).toFixed(2);
  }

  onVendorTap_(event) {
    const flavor = event.model.item;
    this.$.vendorPopup.set('positionTarget', event.path[0]);
    this.$.vendorPopup.set('key', flavor.vendor);
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
