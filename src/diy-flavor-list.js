class DiyFlavorList extends DiyMixinStaticData(Polymer.Element) {
  static get is() {
    return 'diy-flavor-list';
  }

  static get properties() {
    return {
      flavors: {
        type: Array,
        value: () => [],
      },
      limit: {
        type: Number,
        value: 0,
      },
      heading: {
        type: String,
        value: '',
      },
      vendorKey: {
        type: String,
        value: '',
      },
      emptyMessage: {
        type: String,
        value: '',
      },

      showFlavors: {
        type: Array,
        value: () => [],
      },
      numFlavorsText: {
        type: String,
        value: '',
      },
      numHidden: {
        type: Number,
        number: 0,
      },
    };
  }

  static get observers() {
    return [
      'update_(flavors, limit)'
    ];
  }

  update_(flavors, limit) {
    if (flavors.length == 0) {
      this.$.flavorCard.setAttribute('hidden', true);
      this.$.emptyCard.removeAttribute('hidden');
      this.set('numFlavorsText', '');
    } else {
      this.$.flavorCard.removeAttribute('hidden');
      this.$.emptyCard.setAttribute('hidden', true);
      this.set('numFlavorsText', flavors.length + ' flavors');
    }

    // Show all flavors if the limit is unset of big enough.
    if (limit == 0 || flavors.length <= limit) {
      this.onShowAll_();
    } else {
      this.onCollapse_();
    }
  }

  onShowAll_() {
    this.$.showAllButton.setAttribute('hidden', true);
    this.$.flavorsHiddenNotice.setAttribute('hidden', true);
    if (this.limit > 0 && this.flavors.length > this.limit) {
      this.$.collapseButton.removeAttribute('hidden');
    }
    this.showAllFlavors_();
  }

  onCollapse_() {
    if (this.limit > 0 && this.flavors.length > this.limit) {
      this.$.showAllButton.removeAttribute('hidden');
      this.$.flavorsHiddenNotice.removeAttribute('hidden');
    }
    this.$.collapseButton.setAttribute('hidden', true);
    this.showSomeFlavors_();
  }

  showAllFlavors_() {
    const flavors = this.keysToFlavors_(this.flavors);
    this.set('showFlavors', flavors);
    this.set('numHidden', 0);
  }

  showSomeFlavors_() {
    const flavors = this.keysToFlavors_(this.flavors, 0, this.limit);
    this.set('showFlavors', flavors);
    this.set('numHidden', this.flavors.length - flavors.length);
  }

  keysToFlavors_(flavorKeys, startIndex, length) {
    startIndex = startIndex || 0;
    length = Math.min(flavorKeys.length, length || flavorKeys.length);
    let flavors = [];
    for (let i = startIndex; i < startIndex + length; ++i) {
      const key = flavorKeys[i];
      const dummy = { key: key, vendor: 'n/a', name: key };
      const flavor = this.allFlavors[key] || dummy;
      flavors.push(flavor);
    }
    return flavors;
  }

  vendorFromKey_(vendorKey) {
    const vendor = this.allVendors[vendorKey];
    return vendor ? vendor.short : vendorKey;
  }

  onVendorTap_() {
    this.$.vendorPopup.set('positionTarget', this.$.heading);
    this.$.vendorPopup.set('key', this.vendorKey);
    this.$.vendorPopup.open();
  }

  onActionTap_(event) {
    const flavor = event.model.flavor;
    if (!flavor || !flavor.key) return;
    this.$.flavorActions.set('positionTarget', event.path[0]);
    this.$.flavorActions.set('flavor', flavor.key);
    this.$.flavorActions.open();
  }
}

customElements.define(DiyFlavorList.is, DiyFlavorList);
