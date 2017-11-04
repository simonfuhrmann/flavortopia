class DiyAllRecipes extends Polymer.Element {
  static get is() {
    return 'diy-all-recipes';
  }

  openDialog_() {
    this.$.dialog.open();
  }
}

customElements.define(DiyAllRecipes.is, DiyAllRecipes);
