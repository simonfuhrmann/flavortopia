/**
 * Displays a single recipe comment. Recipe comments are stored in a
 * sub-collection in the recipe. The comment key is the user ID,i.e., only
 * one comment per user is allowed:
 *
 * userId: {
 *   rating: Number (1 <= rating <= 5, 0 not rated)
 *   created: Timestamp
 *   comment: String
 * }
 */
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
