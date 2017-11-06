/**
 * Mixin that manages the app route. When the 'route' property changes,
 * the new route state is dispatched to the Redux store. The redux reducer
 * processes the route data and sets the active routes.
 *
 * The 'route' property should only be changed from one place in the app.
 * The active routes can be evaluated wherever needed.
 */
DiyMixinRouter = (superClass) => class extends DiyMixinRedux(superClass) {
  static get properties() {
    return {
      route: {
        type: Object,
        observer: 'onRouteChanged_',
      },
      routeWelcomeActive: {
        type: Boolean,
        statePath: 'appRoute.welcomeActive',
      },
      routeAllFlavorsActive: {
        type: Boolean,
        statePath: 'appRoute.allFlavorsActive',
      },
      routeAllRecipesActive: {
        type: Boolean,
        statePath: 'appRoute.allRecipesActive',
      },
      routeInventoryActive: {
        type: Boolean,
        statePath: 'appRoute.inventoryActive',
      },
      routeRecipesActive: {
        type: Boolean,
        statePath: 'appRoute.recipesActive',
      },
      routeFavoritesActive: {
        type: Boolean,
        statePath: 'appRoute.flavorsActive',
      },
      routeUserSigninActive: {
        type: Boolean,
        statePath: 'appRoute.userSigninActive',
      }
    };
  }

  static get actions() {
    return {
      updateRoute(route) {
        return { type: 'UPDATE_ROUTE', route: route };
      },
    };
  }

  goHome() {
    this.changeRoute('/#/');
  }

  goSignin() {
    this.changeRoute('/#/signin');
  }

  changeRoute(url) {
    window.history.pushState({}, null, url);
    window.dispatchEvent(new CustomEvent('location-changed'));
  }

  onRouteChanged_(route) {
    this.dispatch('updateRoute', route);
  }

};
