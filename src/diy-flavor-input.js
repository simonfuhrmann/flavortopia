class DiyFlavorInput extends DiyMixinStaticData(Polymer.Element) {
  static get is() {
    return 'diy-flavor-input';
  }

  static get properties() {
    return {
      /** The typed search value. On change, update search result. */
      search: {
        type: String,
        notify: true,
        observer: 'onSearchChanged_',
      },
      /** Whether the input field is focused. */
      searchFocused: {
        type: Boolean,
        value: false,
      },
      /** Array for { vendor, flavor } objects. */
      searchResult: {
        type: Array,
        value: () => [],
      },
      /** The selected { vendor, flavor } object. */
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
    // Search and limit the number of results.
    const searchResultKeys = this.searchFlavors(searchTerm);
    searchResultKeys.length = Math.min(50, searchResultKeys.length);
    // Convert search result to { flavor, vendor } objects.
    // TODO: Add undefined checks.
    const searchResult = searchResultKeys.map(flavorKey => {
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
