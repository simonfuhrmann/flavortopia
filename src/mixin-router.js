DiyMixinRouter = (superClass) => class extends superClass {
  static get properties() {
    return {
      routeWelcomeActive: {
        type: Boolean,
        value: false,
      },
      routeAllFlavorsActive: {
        type: Boolean,
        value: false,
      },
      routeAllRecipesActive: {
        type: Boolean,
        value: false,
      },
      routeInventoryActive: {
        type: Boolean,
        value: false,
      },
      routeRecipesActive: {
        type: Boolean,
        value: false,
      },
      routeFavoritesActive: {
        type: Boolean,
        value: false,
      },
    };
  }

  onRouteDataChanged(routeData) {
    const page = routeData ? routeData.page : '';
    const updateProperties = {};
    updateProperties.routeAllFlavorsActive = (page == 'allflavors');
    updateProperties.routeAllRecipesActive = (page == 'allrecipes');
    updateProperties.routeInventoryActive = (page == 'inventory');        
    updateProperties.routeRecipesActive = (page == 'recipes');
    updateProperties.routeFavoritesActive = (page == 'favorites');
    updateProperties.routeWelcomeActive =
        Object.keys(updateProperties).every(value => !updateProperties[value]);
    this.setProperties(updateProperties);
  }
};