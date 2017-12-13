class DiyFlavorList extends Polymer.Element {
  static get is() {
    return 'diy-flavor-list';
  }

  static get properties() {
    return {
      title: {
        type: String,
        value: '',
      },
      emptyMessage: {
        type: String,
        value: '',
      },
      flavors: {
        type: Array,
        value: () => [],
      },
      excerpt: {
        type: Number,
        value: 0,
      },

      info: {
        type: String,
        value: '',
      },
      showAllHidden: {
        type: Boolean,
        value: true,
      },
      collapseHidden: {
        type: Boolean,
        value: true,
      },
      showAll: {
        type: Boolean,
        value: true,
      },
      showFlavors: {
        type: Array,
        value: () => [],
      },
      numHidden: {
        type: Number,
        number: 0,
      },
    };
  }

  static get observers() {
    return [
      'update_(flavors, excerpt)'
    ];
  }

  update_(flavors, excerpt) {
    if (flavors.length == 0) {
      this.$.flavorCard.setAttribute('hidden', true);
      this.$.emptyCard.removeAttribute('hidden');
      this.set('info', '');
    } else {
      this.$.flavorCard.removeAttribute('hidden');
      this.$.emptyCard.setAttribute('hidden', true);
      this.set('info', flavors.length + ' flavors');
    }

    if (excerpt == 0 || flavors.length <= excerpt) {
      this.showAll = true;
      this.setFlavors_();
      return;
    }

    this.onCollapse_();
  }

  setFlavors_() {
    if (this.showAll) {
      this.set('showFlavors', this.flavors);
      this.set('numHidden', 0);
    } else {
      this.set('showFlavors', this.flavors.slice(0, this.excerpt));
      this.set('numHidden', this.flavors.length - this.excerpt);
    }
  }

  onShowAll_() {
    this.$.showAllButton.setAttribute('hidden', true);
    this.$.collapseButton.removeAttribute('hidden');
    this.$.excerptNotice.setAttribute('hidden', true);
    this.showAll = true;
    this.setFlavors_();
  }

  onCollapse_() {
    this.$.collapseButton.setAttribute('hidden', true);
    this.$.showAllButton.removeAttribute('hidden');
    this.$.excerptNotice.removeAttribute('hidden');
    this.showAll = false;
    this.setFlavors_();
  }
}

customElements.define(DiyFlavorList.is, DiyFlavorList);
