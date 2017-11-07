const initialState = {
  appRoute: {
    path: '/',
    pageWelcomeActive: false,
    pageFlavorsActive: false,
    pageRecipesActive: false,
    pageSigninActive: false,
  },
  flavors: {},
  vendors: {},
  userAuth: {
    signedIn: false,
    firebaseUser: undefined,
  },
};

function reducerUpdateRoute(state, action) {
  if (!action.route) return state;
  let newRoute = Object.assign({}, initialState.appRoute);
  newRoute.path = action.route.path || '/';
  switch (newRoute.path) {
    case '/flavors':
      newRoute.pageFlavorsActive = true;
      break;
    case '/recipes':
      newRoute.pageRecipesActive = true;
      break;
    case '/signin':
      newRoute.pageSigninActive = true;
      break;
    default:
      newRoute.pageWelcomeActive = true;
      break;
  }
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
      firebaseUser: action.data.firebaseUser,
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
