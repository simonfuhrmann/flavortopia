class DiyContent extends DiyMixinRouter(Polymer.Element) {
  static get is() {
    return 'diy-content';
  }

  static get properties() {
    return {
      routeData: {
        type: Object,
        observer: 'onRouteDataChanged',
      },
      routeTail: {
        type: Object,
        observer: 'onRouteTailChanged',
      },
    }
  }

  onRouteTailChanged(tail) {
    console.log('tail changed: ', tail)
  }
}

customElements.define(DiyContent.is, DiyContent);