class DiyRecipeEditor extends Polymer.Element {
  static get is() {
    return 'diy-recipe-editor';
  }

  static get properties() {
    return {
      recipe: {
        type: Object,
        value: () => {},
      },
      isNewRecipe: {
        type: Boolean,
        value: false,
      },

      recipeName: String,
      recipeDescription: String,
      recipeIngredients: Array,
      recipePublicNotes: String,
      recipePersonalNotes: String,
      recipeVisibility: {
        type: String,
        value: 'public',
      },
    };
  }

  open(recipeId) {
    this.set('isNewRecipe', !recipeId);
    this.clearForm_();

    // TODO: Set properties.
  }

  clearForm_() {
    // TODO
  }

  onAddIngredientTap_() {
    if (!this.recipeIngredients) {
      this.set('recipeIngredients', []);
    }
    this.push('recipeIngredients', {});
    console.log(this.recipeIngredients);
  }

  onClearIngredientTap_(event) {
    const index = event.model.index;
    this.splice('recipeIngredients', index, 1);
  }

  onMoveIngredientUpTap_(event) {
    const index = event.model.index;
    if (index <= 0) return;
    const item = this.recipeIngredients[index];
    this.splice('recipeIngredients', index, 1);
    this.splice('recipeIngredients', index - 1, 0, item);
  }

  onMoveIngredientDownTap_(event) {
    const index = event.model.index;
    if (index >= this.recipeIngredients.length - 1) return;
    const item = this.recipeIngredients[index];
    this.splice('recipeIngredients', index, 1);
    this.splice('recipeIngredients', index + 1, 0, item);
  }

  onSaveTap_() {
    const recipe = {};
    recipe.name = this.recipeName;
    recipe.publicNotes = this.recipePublicNotes;
    recipe.personalNotes = this.recipePersonalNotes;
    recipe.isPublic = this.recipeVisibility == 'public';
    recipe.ingredients = {};
    for (let i = 0; i < this.recipeIngredients.length; ++i) {
      const ingredient = this.recipeIngredients[i];
      ingredient.index = i;
      if (!this.validateIngredient_(ingredient)) continue;
      recipe.ingrendients[ingredient.flavor] = ingredient.percent;
    }
  }

  validateIngredient_(flavor) {
    const propName = 'recipeIngredients.' + flavor.index + '.error';
    this.set(propName, '');
    if (!flavor.flavor) {
      this.set(propName, 'Invalid ingredient!');
    }
  }

  onDiscardTap_() {
    this.dispatchEvent(new CustomEvent('close-editor'));
  }
}

customElements.define(DiyRecipeEditor.is, DiyRecipeEditor);
