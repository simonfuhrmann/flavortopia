class DiyRecipe extends Polymer.Element {
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
      ingredients: Array,
    };
  }

  onRecipeDataChanged_(recipeData) {
    console.log('recipeData:', recipeData);
    this.set('recipeName', recipeData.name);
    this.set('recipeUserId', recipeData.user);
    this.set('recipeNotes', recipeData.notes);
    this.set('ingredients', this.mapIngredients_(recipeData.ingredients));
  }

  mapIngredients_(ingredients) {
    if (!ingredients) return [];
    const array = [];
    Object.keys(ingredients).forEach(key => {
      array.push({ flavor: key, percent: ingredients[key] });
    });
    return array;
  }
}

customElements.define(DiyRecipe.is, DiyRecipe);
