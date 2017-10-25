class DiyApp extends Polymer.Element {
  static get is() {
    return "diy-app";
  }

  static get properties() {
    return {
      route: {
        type: Object,
        observer: 'onRouteChanged',
      },
      routeData: {
        type: Object,
        observer: 'onRouteDataChanged',
      },
      routeTail: {
        type: Object,
        observer: 'onRouteTailChanged',
      },
      routeAllRecipesActive: Boolean,
      routeAllFlavorsActive: Boolean,
      routeInventoryActive: Boolean,
      routeRecipesActive: Boolean,
      routeFavoritesActive: Boolean,
    };
  }

  toggleDrawer_() {
    // TODO: Slide open when in narrow mode.
    if (this.$.drawerLayout.getAttribute("force-narrow")) {
      this.$.drawerLayout.removeAttribute("force-narrow");
    } else {
      this.$.drawerLayout.setAttribute("force-narrow", true);
    }
  }

  onRouteChanged(newValue) {
    console.log('Route changed to ', newValue);
  }
  onRouteDataChanged(newValue) {
    console.log('Route data changed to ', newValue);
  }
  onRouteTailChanged(newValue) {
    console.log('Route tail changed to ', newValue);
  }
  onRouteRecipesActive(value) {
    console.log('Recipes active: ' + value);
  }
}

customElements.define(DiyApp.is, DiyApp);