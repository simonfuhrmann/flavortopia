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

  changeRoute(url) {
    window.history.pushState({}, null, url);
    window.dispatchEvent(new CustomEvent('location-changed'));
  }

  goHome_() {
    this.changeRoute('/#/');
  }
}

customElements.define(DiyApp.is, DiyApp);
