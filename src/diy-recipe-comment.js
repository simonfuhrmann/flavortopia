class DiyRecipeComment extends DiyMixinCommon(Polymer.Element) {
  static get is() {
    return 'diy-recipe-comment';
  }

  static get properties() {
    return {
      comment: Object,
      username: String,
    };
  }
}

customElements.define(DiyRecipeComment.is, DiyRecipeComment);
