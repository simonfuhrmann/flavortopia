class DiyRecipeEditor extends DiyMixinStaticData(Polymer.Element) {
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

    console.log("opening recipe", recipe);

    this.set('recipeKey', recipe.key);
    this.set('recipeName', recipe.name);
    this.set('recipeDescription', recipe.description);
    this.set('recipePublicNotes', recipe.publicNotes);
    this.set('recipePersonalNotes', recipe.personalNotes);
    this.set('recipeVisibility', recipe.isPublic ? 'public' : 'unlisted');
    this.set('recipeIngredients', this.ingredientsToProperty_(recipe.ingredients));
  }

  clearForm_() {
    this.set('recipeKey', '');
    this.set('recipeName', '');
    this.set('recipeDescription', '');
    this.set('recipePublicNotes', '');
    this.set('recipePersonalNotes', '');
    this.set('recipeVisibility', 'public');
    this.set('recipeIngredients', []);
  }

  ingredientsToProperty_(ingredients) {
    return Object.keys(ingredients).map(flavorKey => {
      const percent = ingredients[flavorKey];
      const flavor = this.allFlavors[flavorKey];
      const vendor = this.allVendors[flavor.vendor];
      return {
        search: flavor.key,
        selected: { flavor, vendor },
        percent: Number(percent).toFixed(2),
        error: undefined,
      };
    });
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
