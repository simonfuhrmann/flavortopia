class DiyRecipeComments extends DiyMixinRedux(Polymer.Element) {
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

      userId: {
        type: String,
        statePath: 'user.auth.firebaseUser.uid',
      },

      userCommented: {
        type: Boolean,
        computed: 'computeUserCommented_(userId, comments)',
      },
    };
  }

  hasComments_(comments) {
    return !!this.comments && this.comments.length > 0;
  }

  hasNoComments_(comments) {
    return !!this.comments && this.comments.length == 0;
  }

  computeUserCommented_(userId, comments) {
    if (!userId || !comments) return false;
    return !!comments.find(comment => comment.key === userId);
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

  onWriteCommentClick_() {
    this.$.writeButtonBox.setAttribute('hidden', true);
    this.$.writeCommentBox.removeAttribute('hidden');

    // If the user previously wrote a comment, initialize with that.
    const comment = this.comments.find(comment => comment.key === this.userId);
    if (comment) {
      this.$.textarea.set('value', comment.comment);
      this.$.userRating.set('rating', comment.rating);
    }
  }

  onCancelClick_() {
    this.$.writeButtonBox.removeAttribute('hidden');
    this.$.writeCommentBox.setAttribute('hidden', true);
  }

  onDeleteClick_() {
    this.$.firebaseStore.deleteComment(this.userId, this.recipeKey)
        .then(data => this.onCancelClick_())
        .catch(error => console.error(error));
  }

  onPostClick_() {
    const comment = {
      rating: this.$.userRating.rating,
      comment: this.$.textarea.value,
    };
    this.$.firebaseStore.setComment(this.userId, this.recipeKey, comment)
        .then(data => this.onCancelClick_())
        .catch(error => console.error(error));
  }
}

customElements.define(DiyRecipeComments.is, DiyRecipeComments);
