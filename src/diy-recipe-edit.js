class DiyRecipeEdit extends Polymer.Element {
  static get is() {
    return 'diy-recipe-edit';
  }

  static get properties() {
    return {
      recipe: {
        type: Object,
        value: () => {},
      },
    };
  }

  onSaveTap_() {

  }
}

customElements.define(DiyRecipeEdit.is, DiyRecipeEdit);
