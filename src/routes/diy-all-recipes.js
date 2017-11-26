class DiyAllRecipes extends DiyMixinRedux(Polymer.Element) {
  static get is() {
    return 'diy-all-recipes';
  }
}

customElements.define(DiyAllRecipes.is, DiyAllRecipes);
