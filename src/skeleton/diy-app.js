class DiyApp extends DiyMixinRouter(Polymer.Element) {
  static get is() {
    return 'diy-app';
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('flavor-actions', this.onFlavorActions_.bind(this));
    window.addEventListener('vendor-popup', this.onVendorPopup_.bind(this));
  }

  onFlavorActions_(event) {
    const detail = event.detail;
    this.$.flavorActions.set('positionTarget', detail.target);
    this.$.flavorActions.set('flavorKey', detail.flavorKey);
    this.$.flavorActions.open();
  }

  onVendorPopup_(event) {
    const detail = event.detail;
    this.$.vendorPopup.set('positionTarget', detail.target);
    this.$.vendorPopup.set('vendorKey', detail.vendorKey);
    this.$.vendorPopup.open();
  }

  toggleDrawer_() {
    if (this.$.drawer.persistent) {
      return;
    }
    if (this.$.drawer.opened) {
      this.$.drawer.close();
    } else {
      this.$.drawer.open();
    }
  }
}

customElements.define(DiyApp.is, DiyApp);
