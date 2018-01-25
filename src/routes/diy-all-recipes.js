class DiyAllRecipes extends DiyMixinRouter(Polymer.Element) {
  static get is() {
    return 'diy-all-recipes';
  }

  static get properties() {
    return {
      isLoading: {
        type: Boolean,
        value: false,
      },
      endReached: {
        type: Boolean,
        value: false,
      },
      startAt: {
        type: Object,
        value: undefined,
      },
      docLimit: {
        type: Number,
        value: 10,
      },
      recipes: {
        type: Array,
        value: () => [],
      },
      user: {
        type: String,
        value: undefined,
      }
    };
  }

  static get observers() {
    return [
      'updateRoute_(activeRoute)',
    ];
  }

  loadRecipes() {
    this.set('endReached', false);
    this.set('startAt', undefined);
    this.set('recipes', []);
    this.loadMore_();
  }

  updateRoute_(activeRoute) {
    const query = activeRoute.query || { user: '' };
    this.set('user', query.user);
    this.loadRecipes();
  }

  loadMore_() {
    this.set('isLoading', true);
    this.$.firebaseStore
        .getRecipes(this.docLimit + 1, this.startAt, this.user)
        .then(snapshot => {
          this.set('isLoading', false);
          this.loadComplete_(snapshot);
        })
        .catch(error => {
          this.set('isLoading', false);
          this.$.errorDialog.openError('Error Loading Recipes', error.message);
        });
  }

  loadComplete_(snapshot) {
    if (!snapshot || snapshot.empty) {
      this.set('endReached', true);
      return;
    }

    const docs = snapshot.docs.map(doc => {
      const docData = doc.data();
      docData.key = doc.id;
      return docData;
    });

    if (docs.length > this.docLimit) {
      this.startAt = snapshot.docs[this.docLimit];
      docs.pop();
      this.set('endReached', false);
      docs.forEach(doc => { this.push('recipes', doc); });
    } else {
      this.startAt = undefined;
      this.set('endReached', true);
      docs.forEach(doc => this.push('recipes', doc));
    }
  }

  hideLoadMoreButton_(endReached, isLoading) {
    return endReached || isLoading;
  }

  onSearchChanged_() {
    this.$.errorDialog.openError(
        'Search Not Available',
        'Due to a restriction in Firebase Firestore, the search feature ' +
        'is not implemented yet.');
    this.$.searchInput.clear();
  }
}

customElements.define(DiyAllRecipes.is, DiyAllRecipes);
