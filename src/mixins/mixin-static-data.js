const staticData = {
  flavors: prepareAllFlavors(),
  vendors: prepareAllVendors(),
  flavorArray: [],
  flavorKeys: [],
  vendorArray: [],
  vendorKeys: [],
};

staticData.flavorsArray = Object.values(staticData.flavors);
staticData.flavorKeys = Object.keys(staticData.flavors);
staticData.vendorsArray = Object.values(staticData.vendors);
staticData.vendorKeys = Object.keys(staticData.vendors);

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
        value: staticData.flavorsArray,
      },
      allVendorsArray: {
        type: Array,
        readOnly: true,
        value: staticData.vendorsArray,
      },

      allFlavorKeys: {
        type: Array,
        readOnly: true,
        value: staticData.flavorKeys,
      },
      allVendorKeys: {
        type: Array,
        readOnly: true,
        value: staticData.vendorKeys,
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
      staticDataFlavorsDf,
      staticDataFlavorsFa,
      staticDataFlavorsFe,
      staticDataFlavorsFlv,
      staticDataFlavorsFw,
      staticDataFlavorsHs,
      staticDataFlavorsInw,
      staticDataFlavorsJf,
      staticDataFlavorsLa,
      staticDataFlavorsMisc,
      staticDataFlavorsRf,
      staticDataFlavorsSc,
      staticDataFlavorsTfa,
      staticDataFlavorsVt,
      staticDataFlavorsWf);

  // De-normalize the flavor key.
  Object.keys(allFlavors).forEach(key => {
    allFlavors[key].key = key;
  });

  // Sanity checks. This should be COMMENTED in a production release.
  //sanityCheckFlavors(allFlavors);

  return allFlavors;
}

function sanityCheckFlavors(allFlavors) {
  console.warn('Flavor sanity checks are enabled, this may be slow.');

  // Check for flavors with invalid characters in the key.
  const allFlavorKeys = Object.keys(allFlavors);
  allFlavorKeys.forEach(key => {
    if (key.match(/[^a-z0-9\-]/)) {
      console.warn('Flavor with invalid key: ' + key);
    }
  });

  // Check for flavors with invalid characters in the name.
  allFlavorKeys.forEach(key => {
    const name = allFlavors[key].name;
    if (!name) {
      console.warn('Flavor without a name: ' + key);
      return;
    }
    if (name.match(/[^a-zA-Z0-9\-%'&!(),./ ]/)) {
      console.warn('Flavor with invalid name: ' + name + ', key: ' + key);
    }
  });

  // Check that all words in the flavor name are also in the key.
  allFlavorKeys.forEach(key => {
    const name = allFlavors[key].name;
    let cleanName = name.replace(/\W/g, ' ').replace(/ +/g, ' ');
    let tokens = cleanName.split(' ')
        .filter(token => !!token)
        .map(token => token.toLowerCase());
    for (let i = 0; i < tokens.length; ++i) {
      if (!key.includes(tokens[i])) {
        console.warn('Recipe key incomplete: ' + key + ' (' + name + ')');
      }
    }
  });

  // Check that flavors are sorted.
  for (let i = 1; i < allFlavorKeys.length; ++i) {
    const key1 = allFlavorKeys[i];
    const key2 = allFlavorKeys[i - 1]
    if (allFlavors[key1].vendor != allFlavors[key2].vendor) continue;
    const name1 = allFlavors[key1].name;
    const name2 = allFlavors[key2].name;
    if (name1.toLowerCase() < name2.toLowerCase()) {
      console.warn('Flavor not sorted: ' + name2 + ' (' + key2
          + ') and ' + name1 + ' (' + key1 + ')');
    }
  }
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
