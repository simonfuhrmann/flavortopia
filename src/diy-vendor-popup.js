class DiyVendorPopup extends DiyMixinStaticData(Polymer.Element) {
  static get is() {
    return 'diy-vendor-popup';
  }

  static get properties() {
    return {
      key: {
        type: String,
        observer: 'onKeyChanged_',
      },
      positionTarget: Object,

      vendorShort: String,
      vendorName: String,
      vendorWebsite: String,
    };
  }

  open() {
    this.$.dropdown.open();
  }

  close() {
    this.$.dropdown.close();
  }

  onKeyChanged_(key) {
    const vendorData = this.allVendors[key];
    if (!vendorData) {
      this.setProperties({
        vendorShort: key,
        vendorName: 'Unknown Vendor',
        vendorWebsite: undefined,
        vendorDescription: 'A vendor called "' + key + '" was not found.',
      });
      return;
    }
    this.setProperties({
      vendorShort: vendorData.short,
      vendorName: vendorData.name,
      vendorWebsite: vendorData.website,
      vendorDescription: vendorData.description,
    });
  }
}

customElements.define(DiyVendorPopup.is, DiyVendorPopup);
