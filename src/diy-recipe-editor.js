class DiyRecipeEditor extends
    DiyMixinCommon(DiyMixinStaticData(Polymer.Element)) {
  static get is() {
    return 'diy-recipe-editor';
  }

  static get properties() {
    return {
      userId: String,

      /**
       * The format of a recipe in the database:
       *
       * {
       *   key: <String>,
       *   user: <String>,
       *   name: <String>,
       *   description: <String>,
       *   notes: <String>,
       *   created: <Timestamp>,
       *   isPublic: <Boolean>,
       *   ingredients: [
       *     { flavor: <String>, percent: <Number> },
       *     { ... },
       *   ],
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
      recipeNotes: String,
      recipeCreated: Object,

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
      recipeNotes: recipe.notes,
      recipeCreated: recipe.created,
      recipeVisibility: recipe.isPublic ? 'public' : 'unlisted',
      recipeIngredients: this.ingredientsToProperty_(recipe.ingredients),
    });
  }

  clearForm_() {
    this.setProperties({
      recipeKey: '',
      recipeName: '',
      recipeDescription: '',
      recipeNotes: '',
      recipeCreated: null,
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
    if (!this.recipeName || this.recipeName.length < 3) {
      this.$.recipeNameInput.set(
          'error', 'Provide at least 3 characters for the recipe name');
      hasErrors = true;
    }

    // Check that there is at least one ingredient.
    if (!this.recipeIngredients || this.recipeIngredients.length == 0) {
      this.$.dialog.openError(
          'No Ingredients',
          'Add some ingredients to your recipe before saving.')
      return;
    }

    // Validate each ingredient.
    for (let i = 0; i < this.recipeIngredients.length; ++i) {
      const ingredient = this.recipeIngredients[i];
      const percent = this.stringToNumber(ingredient.percent);
      if (isNaN(percent)) {
        this.set('recipeIngredients.' + i + '.error', true);
        hasErrors = true;
      }
    }
    if (hasErrors) {
      return;
    }

    // Check if an active user is set. Otherwise saving is not possible.
    if (!this.userId) {
      this.$.dialog.openError(
          'No User ID Set',
          'The recipe can not be saved. A user ID has not been set.');
      return;
    }

    // Create recipe database representation.
    const recipe = {
      key: this.recipeKey,
      user: this.userId,
      name: this.recipeName,
      description: this.recipeDescription,
      notes: this.recipeNotes,
      created: this.recipeCreated,
      isPublic: this.recipeVisibility == 'public',
      ingredients: this.ingredientsFromProperty_(),
    };

    this.saveRecipe_(recipe);
  }

  // Converts the ingredients array from DB to property representation.
  ingredientsToProperty_(ingredients) {
    return ingredients.map(ingredient => {
      const flavorKey = ingredient.flavor;
      const percent = String(ingredient.percent);
      const flavor = this.flavorForKey(flavorKey);
      const vendor = this.vendorForKey(flavor.vendor);
      return {
        search: flavor.key,
        selected: { flavor, vendor },
        percent: percent,
        error: false,
      };
    });
  }

  // Converts the ingredients from property to DB representation.
  ingredientsFromProperty_() {
    if (!this.recipeIngredients) return [];
    return this.recipeIngredients.map(ingredient => {
      // Use key of selected flavor, or search string if unselected.
      const flavorKey = ingredient.selected
          ? ingredient.selected.flavor.key
          : ingredient.search;
      return {
        flavor: flavorKey,
        percent: this.stringToNumber(ingredient.percent),
      };
    });
  }

  saveRecipe_(recipe) {
    this.deleteUndefinedProperties(recipe);
    this.deleteEmptyStringProperties(recipe);
    this.$.firebaseStore.setRecipe(recipe)
        .then(() => {
          this.set('recipe', recipe);
          this.dispatchEvent(new CustomEvent('close-editor'));
        })
        .catch(error => {
          this.$.dialog.openError('Error Saving Recipe', error.message);
        });
  }

  onDiscardTap_() {
    this.dispatchEvent(new CustomEvent('close-editor'));
  }

  onIngredientsInfoTap_() {
    const title = 'Notes on Ingredients';
    const content = 'Shake and Vape does not believe in specifying base '
        + 'ingredients (PG, VG, nicotine, etc.) as part of your recipe. '
        + 'Instead, it can be configured when mixing a recipe. If you have a '
        + 'suggestion for a PG/VG ratio, put it in the recipe notes.';
    this.$.dialog.openInfo(title, content);
  }

  onRecipeNotesInfoTap_() {
    const title = 'Recipe Notes';
    const content = 'Recipe notes are not shown in the compact recipe view, '
        + 'only when the recipe is shown individually. Add additional '
        + 'information here for interested users, but keep important '
        + 'information in the recipe description.';
    this.$.dialog.openInfo(title, content);
  }

  onVisibilityInfoTap_() {
    const title = 'Recipe Visibility';
    const content = 'Your recipe stored in a database powered by Firebase. '
        + 'The visibility selection will be stored as a flag as part of '
        + 'your recipe. Shake and Vape will not display unlisted recipes to '
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
