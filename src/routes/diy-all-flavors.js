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
      searchFlavors: {
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
      this.set('searchFlavors', undefined);
      return;
    }

    // Create array of cleaned search terms.
    const cleaned = searchTerm.replace(/\s+/g, ' ').replace(/[^\w ]/g, '');
    const terms = cleaned.toLowerCase().split(' ');

    // Create array of flavors that match the search terms.
    const searchResult = this.allFlavorsArray.filter(flavor => {
      const subject = (flavor.vendor + ' ' + flavor.name).toLowerCase();
      return terms.reduce((isMatch, elem) => {
        return isMatch && subject.includes(elem)
      }, true);
    });

    // Map the search result to flavor keys.
    const searchResultKeys = searchResult.map(flavor => flavor.key);
    this.set('searchFlavors', searchResultKeys);
  }

  hasSearchResults_(searchFlavors) {
    return searchFlavors && searchFlavors.length > 0;
  }
}

customElements.define(DiyAllFlavors.is, DiyAllFlavors);
