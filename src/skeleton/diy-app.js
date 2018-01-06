class DiyApp extends DiyMixinRouter(Polymer.Element) {
  static get is() {
    return 'diy-app';
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
