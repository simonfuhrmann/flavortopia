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

  recipesActive_(path) {
    return path == '/recipes';
  }

  flavorsActive_(path) {
    return path == '/flavors';
  }
}

customElements.define(DiyApp.is, DiyApp);
