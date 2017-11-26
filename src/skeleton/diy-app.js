class DiyApp extends DiyMixinRouter(Polymer.Element) {
  static get is() {
    return 'diy-app';
  }
}

customElements.define(DiyApp.is, DiyApp);
