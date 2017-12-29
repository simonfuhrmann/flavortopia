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
        value: true,
      },

      recipeName: String,
      recipeDescription: String,
      recipeIngredients: {
        type: Array,
        value: () => [],
      },
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

  onIngredientsInfoTap_() {
    const title = 'Notes on Ingredients';
    const content = 'Flavortopia does not believe in specifying base '
        + 'ingredients (PG, VG, nicotine, etc.) as part of your recipe. '
        + 'Instead, it can be configured when mixing a recipe. If you have a '
        + 'suggestion for a PG/VG ratio, put it in the recipe notes.';
    this.$.dialog.openInfo(title, content);
  }

  onVisibilityInfoTap_() {
    const title = 'Recipe Visibility';
    const content = 'Your recipe stored in a database powered by Firebase. '
        + 'The visibility selection will be stored as a flag as part of '
        + 'your recipe. Flavortopia will not display unlisted recipes to '
        + 'other users. Note, however, that all recipes could be queried by '
        + 'proficient users. Do not submit confidential information with your '
        + 'recipes.';
    this.$.dialog.openInfo(title, content);
  }

  onAddIngredientTap_() {
    if (!this.recipeIngredients) {
      this.set('recipeIngredients', []);
    }
    this.push('recipeIngredients', {});
    setTimeout(this.focusLastIngredient_.bind(this), 0);
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

  onDiscardTap_() {
    this.dispatchEvent(new CustomEvent('close-editor'));
  }

  focusLastIngredient_() {
    let inputs = this.shadowRoot.querySelectorAll('diy-flavor-input');
    if (!inputs || inputs.length == 0) return;
    inputs[inputs.length - 1].focus();
  }

  validateIngredient_(flavor) {
    const propName = 'recipeIngredients.' + flavor.index + '.error';
    this.set(propName, '');
    if (!flavor.flavor) {
      this.set(propName, 'Invalid ingredient!');
    }
  }
}

customElements.define(DiyRecipeEditor.is, DiyRecipeEditor);
