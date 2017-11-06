class DiyApp extends DiyMixinRouter(Polymer.Element) {
  static get is() {
    return 'diy-app';
  }

  static get properties() {
    return {
      route: Object,
      routeData: Object,
      routeTail: Object,
    };
  }
}

customElements.define(DiyApp.is, DiyApp);
