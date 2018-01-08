const staticData = {
  flavors: prepareAllFlavors(),
  vendors: prepareAllVendors(),
};

DiyMixinStaticData = (superClass) => class extends superClass {
  static get properties() {
    return {
      allFlavors: {
        type: Object,
        readOnly: true,
        value: staticData.flavors,
      },
      allVendors: {
        type: Object,
        readOnly: true,
        value: staticData.vendors,
      },

      allFlavorsArray: {
        type: Array,
        readOnly: true,
        value: function() {
          return Object.values(staticData.flavors);
        },
      },
      allVendorsArray: {
        type: Array,
        readOnly: true,
        value: function() {
          return Object.values(staticData.vendors);
        },
      },

      allFlavorKeys: {
        type: Array,
        readOnly: true,
        value: function() {
          return Object.keys(staticData.flavors);
        },
      },
      allVendorKeys: {
        type: Array,
        readOnly: true,
        value: function() {
          return Object.keys(staticData.vendors);
        },
      },
    };
  }

  // Returns a flavor object for the given flavor key. If the flavor is not
  // known, a mock object is returned with all common fields for safe usage.
  flavorForKey(flavorKey) {
    const flavor = this.allFlavors[flavorKey];
    return flavor || { key: flavorKey, name: flavorKey, vendor: '???' };
  }

  // Returns a vendor object for the given vendor key. If the vendor is not
  // known, a mock object is returned with all common fields for safe usage.
  vendorForKey(vendorKey) {
    const vendor = this.allVendors[vendorKey];
    return vendor || { key: vendorKey, name: 'Unknown', short: '???' };
  }

  // Returns a vendor object for the given flavor key. If the flavor or the
  // vendor is not known, a mock object is returned with common fields set.
  vendorForFlavorKey(flavorKey) {
    const flavor = this.flavorForKey(flavorKey);
    return this.vendorForKey(flavor.vendor);
  }

  // Returns an array with flavor keys for flavors that match the search terms.
  // The search matches both, the flavor vendor and the flavor name.
  searchFlavors(searchString) {
    if (!searchString) {
      return [];
    }

    // Clean the search string.
    const cleaned = searchString
        .replace(/\s+/g, ' ')       // Collapse whitespaces into blanks.
        .replace(/[^\w\- ]/g, '');  // Remove non-word characters.

    // Split search terms at spaces.
    const terms = cleaned.toLowerCase().split(' ');

    // Create an array of flavors that match the search terms.
    const searchResult = this.allFlavorsArray.filter(flavor => {
      const subject = flavor.key;
      return terms.reduce((isMatch, elem) => {
        return isMatch && subject.includes(elem)
      }, true);
    });

    // Map the search result to flavor keys.
    return searchResult.map(flavor => flavor.key);
  }
};

function prepareAllFlavors() {
  // Copy all flavors into a new object.
  const allFlavors = Object.assign({},
      staticDataFlavorsCap,
      staticDataFlavorsFa,
      staticDataFlavorsFlv,
      staticDataFlavorsFw,
      staticDataFlavorsTfa,
      staticDataFlavorsWf);
  // De-normalize the flavor key.
  Object.keys(allFlavors).forEach(key => {
    allFlavors[key].key = key;
  });
  // Check for flavors with invalid characters in the key.
  Object.keys(allFlavors).forEach(key => {
    if (key.match(/[^a-zA-Z0-9\-]/)) {
      console.warn('Flavor with invalid key: ' + key);
    }
  });
  return allFlavors;
}

function prepareAllVendors() {
  // Copy all vendors into a new object.
  const allVendors = Object.assign({}, staticDataVendors);
  // De-normalize the vendor key.
  Object.keys(allVendors).forEach(key => {
    allVendors[key].key = key;
  });
  return allVendors;
}
