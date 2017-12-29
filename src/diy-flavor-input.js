class DiyFlavorInput extends DiyMixinStaticData(Polymer.Element) {
  static get is() {
    return 'diy-flavor-input';
  }

  static get properties() {
    return {
      search: {
        type: String,
        notify: true,
        observer: 'onSearchChanged_',
      },
      searchFocused: {
        type: Boolean,
        value: false,
      },
      searchResult: {
        type: Array,
        value: () => [],
      },
      selected: {
        type: Object,
        value: null,
        notify: true,
      },
    };
  }

  onSearchChanged_(search) {
    this.populateSearch_(search);
  }

  focus() {
    this.$.input.focus();
  }

  populateSearch_(searchTerm) {
    if (!searchTerm) {
      this.set('searchResult', []);
      return;
    }
    // TODO: Add undefined checks.
    const searchResult = this.searchFlavors(searchTerm).map(flavorKey => {
      const flavor = this.allFlavors[flavorKey];
      const vendor = this.allVendors[flavor.vendor];
      return { flavor, vendor };
    });
    this.set('searchResult', searchResult);
  }

  hasNoResults_(search, searchResult) {
    return search && searchResult && searchResult.length == 0;
  }

  hasNoString_(search) {
    return !search;
  }

  onResultTap_(event) {
    const selected = event.model.item;
    this.set('selected', selected);
  }

  onEditSelectedTap_() {
    this.set('selected', null);
    this.$.input.focus();
  }
}

customElements.define(DiyFlavorInput.is, DiyFlavorInput);
