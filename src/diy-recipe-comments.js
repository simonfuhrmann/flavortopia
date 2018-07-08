class DiyRecipeComments extends Polymer.Element {
  static get is() {
    return 'diy-recipe-comments';
  }

  static get properties() {
    return {
      recipeKey: {
        type: String,
        value: '',
        observer: 'onRecipeKeyChanged_',
      },

      isLoading: {
        type: Boolean,
        value: false,
      },

      loadingError: {
        type: String,
        value: '',
      },

      comments: {
        type: Array,
        value: null,
        observer: 'onCommentsChanged_',
      },

      rating: {
        type: Object,
        value: () => {
          return { average: 0.0, numRatings: 0 };
        },
      },
    };
  }

  hasComments_(comments) {
    return !!this.comments && this.comments.length > 0;
  }

  hasNoComments_(comments) {
    return !!this.comments && this.comments.length == 0;
  }

  onRecipeKeyChanged_(recipeKey) {
    if (!recipeKey) {
      this.set('comments', []);
      return;
    }
    this.$.firebaseGet.subscribeRecipeComments(recipeKey);
  }

  onCommentsChanged_(comments) {
    if (!comments) return;

    // Compute average rating from comments.
    let rating = {
      average: 0.0,
      numRatings: 0,
    };
    comments.forEach(comment => {
      if (comment.rating && comment.rating >= 1 && comment.rating <= 5) {
        rating.average += comment.rating;
        rating.numRatings += 1;
      }
    });
    if (rating.numRatings > 0) {
      rating.average = rating.average / rating.numRatings;
    }
    this.set('rating', rating);
  }
}

customElements.define(DiyRecipeComments.is, DiyRecipeComments);
