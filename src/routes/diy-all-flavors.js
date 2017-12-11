class DiyAllFlavors extends DiyMixinStaticData(Polymer.Element) {
  static get is() {
    return 'diy-all-flavors';
  }

  static get properties() {
    return {
      flavorsByVendor: Array,
      searchTerm: {
        type: String,
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
    this.allFlavorKeys.forEach(flavorKey => {
      const flavor = Object.assign({}, this.allFlavors[flavorKey]);
      flavor.key = flavorKey;
      if (!byVendorMap[flavor.vendor]) {
        byVendorMap[flavor.vendor] = [];
      }
      byVendorMap[flavor.vendor].push(flavor);
    });

    console.log(byVendorMap);

    // Convert to a vendor array.
    const byVendorArray = [];
    for (const vendorKey in byVendorMap) {
      const vendor = this.allVendors[vendorKey];
      const flavors = byVendorMap[vendorKey];
      byVendorArray.push({ vendor, flavors });
    }
    this.set('flavorsByVendor', byVendorArray);
  }

  onSearchTermChanged_(searchTerm) {
    if (!searchTerm) {
      this.set('searchFlavors', undefined);
      return;
    }

    // Clean non-alphanum characters, condense white spaces.
    const cleaned = searchTerm.replace(/\s+/g, ' ').replace(/[^\w ]/g, '');
    const terms = cleaned.toLowerCase().split(' ');
    const filteredKeys = this.allFlavorKeys.filter(flavorKey => {
      const flavor = this.allFlavors[flavorKey];
      const subject = (flavor.vendor + ' ' + flavor.name).toLowerCase();
      return terms.reduce((isMatch, elem) => {
        return isMatch && subject.includes(elem)
      }, true);
    });

    // Create array with flavors.
    const flavors = filteredKeys.map(key => this.allFlavors[key]);
    this.set('searchFlavors', flavors);
  }

  hasSearchResults_(searchFlavors) {
    return searchFlavors && searchFlavors.length > 0;
  }
}

customElements.define(DiyAllFlavors.is, DiyAllFlavors);
