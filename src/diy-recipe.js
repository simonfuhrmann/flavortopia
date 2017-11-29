class DiyRecipe extends DiyMixinRedux(Polymer.Element) {
  static get is() {
    return 'diy-recipe';
  }

  static get properties() {
    return {
      recipeData: {
        type: Object,
        observer: 'onRecipeDataChanged_',
      },
      recipeName: String,
      recipeUserId: String,
      recipeAuthor: String,
      recipeNotes: String,
      recipeCreated: String,
      ingredients: Array,
      hasIngredients: Boolean,
      hasRecipeNotes: Boolean,
    };
  }

  onRecipeDataChanged_(recipeData) {
    this.set('recipeName', recipeData.name);
    this.set('recipeUserId', recipeData.user);
    this.set('recipeNotes', recipeData.notes || '');
    this.set('recipeCreated', this.timestampToString_(recipeData.created));
    this.set('ingredients', this.mapIngredients_(recipeData.ingredients));
    this.set('hasIngredients', this.ingredients.length > 0);
    this.set('hasRecipeNotes', this.recipeNotes.length > 0);
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
    Object.keys(ingredients).forEach(key => {
      array.push({ flavor: key, percent: ingredients[key] });
    });
    return array;
  }

  onEditTap_() {
  }

  onMixTap_() {
  }

  onDeleteTap_() {
  }
}

customElements.define(DiyRecipe.is, DiyRecipe);
