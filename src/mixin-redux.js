const initialState = {
  appRoute: {
    path: '/',  // The route path, e.g., /flavors.
    query: {},  // The route query parameters, e.g., { foo: "bar" }.
    fragment: '',  // The route fragment (part after the '#' in the URL).
    isWelcomeActive: false,
    isFlavorsActive: false,
    isRecipesActive: false,
    isUserSigninActive: false,
    isUserActionActive: false,
  },
  flavors: {},
  vendors: {},
  userAuth: {
    signedIn: false,
    firebaseUser: undefined,
  },
};

// Parses a URL and returns the path, query and fragment components. The path
// and fragment are returned as strings, and the query is returned as object
// with key/value pairs.
// Example: /path?search=xxx#frag
// Result: { path: "/path", query: {search: "xxx"}, fragment: "frag" }
function parsePathQueryFragment(url) {
  const [pathQuery, fragment] = url.split('#');
  const [path, queryString] = pathQuery.split('?');

  const query = {};
  if (queryString) {
    const values = queryString.split('&');
    for (let i = 0; i < values.length; ++i) {
      const pair = values[i].split('=');
      if (pair[0] && pair[1]) {
        query[pair[0]] = pair[1];
      }
    }
  }
  return {path, query, fragment};
}

function reducerUpdateRoute(state, action) {
  if (!action.route) return state;
  const url =  action.route.path || '/';
  const pathQueryFragment = parsePathQueryFragment(url);
  const newRoute = Object.assign({}, initialState.appRoute, pathQueryFragment);
  switch (newRoute.path) {
    case '/flavors':
      newRoute.isFlavorsActive = true;
      break;
    case '/recipes':
      newRoute.isRecipesActive = true;
      break;
    case '/user/signin':
      newRoute.isUserSigninActive = true;
      break;
    case '/user/action':
      newRoute.isUserActionActive = true;
      break;
    default:
      newRoute.isWelcomeActive = true;
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
