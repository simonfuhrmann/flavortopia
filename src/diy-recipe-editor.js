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
    };
  }

  open(recipeId) {
    if (!recipeId) {
      this.clearForm_();
      return;
    }
  }

  clearForm_() {
    // TODO
  }

  onSaveTap_() {
  }

  onDiscardTap_() {
    this.dispatchEvent(new CustomEvent('close-editor'));
  }
}

customElements.define(DiyRecipeEditor.is, DiyRecipeEditor);
