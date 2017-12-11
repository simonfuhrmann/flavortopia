class DiyVendorShort extends DiyMixinStaticData(Polymer.Element) {
  static get is() {
    return 'diy-vendor-short';
  }

  static get properties() {
    return {
      key: {
        type: String,
        observer: 'onKeyChanged_',
      },
      vendorShort: String,
      vendorName: String,
      vendorWebsite: String,
    };
  }

  onKeyChanged_(key) {
    const vendorData = this.allVendors[key];
    if (!vendorData) {
      this.setProperties({
        vendorShort: key,
        vendorName: undefined,
        vendorWebsite: undefined,
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

  onVendorTap_() {
    if (this.$.tooltip.hasAttribute('hidden')) {
      this.$.tooltip.removeAttribute('hidden');
    } else {
      this.$.tooltip.setAttribute('hidden', true);
    }
  }

  onTooltipTap_() {
    this.$.tooltip.setAttribute('hidden', true);
  }
}

customElements.define(DiyVendorShort.is, DiyVendorShort);
