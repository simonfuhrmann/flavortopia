class DiyAllFlavors extends DiyMixinStaticData(Polymer.Element) {
  static get is() {
    return 'diy-all-flavors';
  }

  static get properties() {
    return {
      flavorsByVendor: Array,
      searchTerm: {
        type: String,
        value: '',
        observer: 'onSearchTermChanged_',
      },
      flavorsSearch: {
        type: Array,
        value: () => [],
      }
    };
  }

  ready() {
    super.ready();

    // Group all flavors by vendor.
    const byVendorMap = {};
    this.allFlavorsArray.forEach(flavor => {
      if (!byVendorMap[flavor.vendor]) {
        byVendorMap[flavor.vendor] = [];
      }
      byVendorMap[flavor.vendor].push(flavor.key);
    });

    // Convert to a vendor array.
    const byVendorArray = [];
    Object.keys(byVendorMap).forEach(vendorKey => {
      const vendor = this.allVendors[vendorKey];
      const flavors = byVendorMap[vendorKey];
      byVendorArray.push({ vendor, flavors });
    });

    this.set('flavorsByVendor', byVendorArray);
  }

  onSearchTermChanged_(searchTerm) {
    if (!searchTerm) {
      this.set('flavorsSearch', undefined);
      return;
    }
    this.set('flavorsSearch', this.searchFlavors(searchTerm));
  }

  hasSearchResults_(flavorsSearch) {
    return flavorsSearch && flavorsSearch.length > 0;
  }
}

customElements.define(DiyAllFlavors.is, DiyAllFlavors);
