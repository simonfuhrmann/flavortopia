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
      // The app route as provided by <app-location>. On change, update the
      // route in the global Redux state.
      route: {
        type: Object,
        observer: 'onRouteChanged_',
      },
      // The route path as computed by the global Redux state.
      path: {
        type: String,
        statePath: 'appRoute.path',
      },
      pageWelcomeActive: {
        type: Boolean,
        statePath: 'appRoute.pageWelcomeActive',
      },
      pageRecipesActive: {
        type: Boolean,
        statePath: 'appRoute.pageRecipesActive',
      },
      pageFlavorsActive: {
        type: Boolean,
        statePath: 'appRoute.pageFlavorsActive',
      },
      pageSigninActive: {
        type: Boolean,
        statePath: 'appRoute.pageSigninActive',
      },
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
