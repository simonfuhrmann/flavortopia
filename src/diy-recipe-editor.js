class DiyRecipeEditor extends
    DiyMixinCommon(DiyMixinStaticData(Polymer.Element)) {
  static get is() {
    return 'diy-recipe-editor';
  }

  static get properties() {
    return {
      /**
       * The format of recipe is as follows:
       *
       * {
       *   key: <String>,
       *   name: <String>,
       *   description: <String>,
       *   publicNotes: <String>,
       *   personalNotes: <String>,
       *   created: <Timestamp>,
       *   isPublic: <Boolean>,
       *   ingredients: {
       *     'cap-lime': <Number>,
       *     'tfa-apricot': <Number>,
       *   },
       * }
       */
      recipe: {
        type: Object,
        value: () => {},
      },
      isNewRecipe: {
        type: Boolean,
        value: true,
      },

      recipeKey: String,
      recipeName: String,
      recipeDescription: String,
      recipePublicNotes: String,
      recipePersonalNotes: String,

      /**
       * An array of ingredient objects. Each ingredient contains the search
       * term, the selected flavor, the percent, and an error if the ingredient
       * is invalid: { search, selected, percent, error }.
       */
      recipeIngredients: {
        type: Array,
        value: () => [],
      },
      /** The visibility is either 'public' or 'unlisted'. */
      recipeVisibility: {
        type: String,
        value: 'public',
      },
    };
  }

  open(recipe) {
    this.set('isNewRecipe', !recipe);
    if (!recipe) {
      this.clearForm_();
      return;
    }

    this.setProperties({
      recipeKey: recipe.key,
      recipeName: recipe.name,
      recipeDescription: recipe.description,
      recipePublicNotes: recipe.publicNotes,
      recipePersonalNotes: recipe.personalNotes,
      recipeVisibility: recipe.isPublic ? 'public' : 'unlisted',
      recipeIngredients: this.ingredientsToProperty_(recipe.ingredients),
    });
  }

  clearForm_() {
    this.setProperties({
      recipeKey: '',
      recipeName: '',
      recipeDescription: '',
      recipePublicNotes: '',
      recipePersonalNotes: '',
      recipeVisibility: 'public',
      recipeIngredients: [],
    });
  }

  onSaveTap_() {
    // Clear previous errors.
    this.$.recipeNameInput.set('error', undefined);
    for (let i = 0; i < this.recipeIngredients.length; ++i) {
      this.set('recipeIngredients.' + i + '.error', false);
    }

    // Validate inputs.
    let hasErrors = false;
    if (!this.recipeName) {
      this.$.recipeNameInput.set('error', 'Please provide a recipe name');
      hasErrors = true;
    }
    for (let i = 0; i < this.recipeIngredients.length; ++i) {
      const ingredient = this.recipeIngredients[i];
      const percent = this.stringToNumber(ingredient.percent);
      const selected = ingredient.selected;
      if (isNaN(percent) || !selected || !selected.flavor) {
        this.set('recipeIngredients.' + i + '.error', true);
        hasErrors = true;
      }
    }
    if (hasErrors) {
      return;
    }

    // Create recipe database representation.
    const recipe = {
      key: this.recipeKey,
      name: this.recipeName,
      description: this.recipeDescription,
      publicNotes: this.recipePublicNotes,
      personalNotes: this.recipePersonalNotes,
      isPublic: this.recipeVisibility == 'public',
      ingredients: this.ingredientsFromProperty_(),
    };

    console.log('Recipe for DB:', recipe);
  }

  ingredientsToProperty_(ingredients) {
    return Object.keys(ingredients).map(flavorKey => {
      const percent = this.stringToNumber(ingredients[flavorKey]);
      const flavor = this.flavorForKey(flavorKey);
      const vendor = this.vendorForKey(flavor.vendor);
      return {
        search: flavor.key,
        selected: { flavor, vendor },
        percent: this.formatPercent(percent),
        error: false,
      };
    });
  }

  ingredientsFromProperty_() {
    if (!this.recipeIngredients) return {};
    const result = {};
    for (let i = 0; i < this.recipeIngredients.length; ++i) {
      const ingredient = this.recipeIngredients[i];
      const flavorKey = ingredient.selected.flavor.key;
      result[flavorKey] = this.stringToNumber(ingredient.percent);
    }
    return result;
  }

  onDiscardTap_() {
    this.dispatchEvent(new CustomEvent('close-editor'));
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
    this.push('recipeIngredients', { percent: 0.0 });
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

  focusLastIngredient_() {
    let inputs = this.shadowRoot.querySelectorAll('diy-flavor-input');
    if (!inputs || inputs.length == 0) return;
    inputs[inputs.length - 1].focus();
  }
}

customElements.define(DiyRecipeEditor.is, DiyRecipeEditor);
