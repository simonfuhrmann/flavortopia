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

  // Returns an array with flavor keys for flavors that match the search terms.
  // The search matches both, the flavor vendor and the flavor name.
  searchFlavors(searchString) {
    if (!searchString) {
      return [];
    }

    // Replace consecutive whitespace characters with single spaces.
    const cleaned = searchString.replace(/\s+/g, ' ').replace(/[^\w ]/g, '');

    // Split search terms at spaces.
    const terms = cleaned.toLowerCase().split(' ');

    // Create an array of flavors that match the search terms.
    const searchResult = this.allFlavorsArray.filter(flavor => {
      const subject = (flavor.vendor + ' ' + flavor.name).toLowerCase();
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
      staticDataFlavorsTfa);
  // De-normalize the flavor key.
  Object.keys(allFlavors).forEach(key => {
    allFlavors[key].key = key;
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
