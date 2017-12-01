const staticData = {
  flavors: Object.assign({}, staticDataFlavorsCap),
  vendors: Object.assign({}, staticDataVendors),
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
      allFlavorKeys: {
        type: Object,
        readOnly: true,
        value: function() {
          return Object.keys(staticData.flavors);
        },
      },
      allVendorKeys: {
        type: Object,
        readOnly: true,
        value: function() {
          return Object.keys(staticData.vendors);
        },
      },
    };
  }
};
