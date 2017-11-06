const initialState = {
  appRoute: {
    welcomeActive: false,
    userSigninActive: false,
    allFlavorsActive: false,
    allRecipesActive: false,
    inventoryActive: false,
    recipesActive: false,
    flavorsActive: false,
  },
  flavors: {},
  vendors: {},
  userAuth: {
    signedIn: false,
  },
};

function reducerUpdateRoute(state, action) {
  if (!action.route) return state;
  const path = action.route.path || '';
  let newRoute = {
    allFlavorsActive: (path == '/allflavors'),
    allRecipesActive: (path == '/allrecipes'),
    inventoryActive: (path == '/inventory'),
    recipesActive: (path == '/recipes'),
    flavorsActive: (path == '/favorites'),
    userSigninActive: (path == '/signin'),
  };
  // Activate the welcome page if no other route is active.
  newRoute.welcomeActive = Object.keys(newRoute).every(key => !newRoute[key]);
  return Object.assign({}, state, { appRoute: newRoute });
}

function reducerInitFlavors(state, action) {
  return Object.assign({}, state, { flavors: action.data });
}

function reducerInitVendors(state, action) {
  return Object.assign({}, state, { vendors: action.data });
}

function reducerUserSignin(state, action) {
  return Object.assign({}, state, {
    userAuth: {
      signedIn: action.data.signedIn,
    },
  });
}

const reduxReducer = function(state = initialState, action) {
  switch (action.type) {
    case 'INIT_FLAVORS':
      return reducerInitFlavors(state, action);
    case 'INIT_VENDORS':
      return reducerInitVendors(state, action);
    case 'UPDATE_ROUTE':
      return reducerUpdateRoute(state, action);
    case 'USER_SIGNIN':
      return reducerUserSignin(state, action);
  }
  return state;
}

const reduxStore = Redux.createStore(reduxReducer);
const DiyMixinRedux = PolymerRedux(reduxStore);
