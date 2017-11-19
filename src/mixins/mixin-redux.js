const initialState = {
  appRoute: {
    path: '/',  // The URL path, e.g., /flavors.
    query: {},  // The URL query parameters, e.g., { foo: "bar" }.
    fragment: '',  // The URL fragment (part after the '#' in the URL).
    isWelcomeActive: false,
    isFlavorsActive: false,
    isRecipesActive: false,
    isUserRecipesActive: false,
    isUserSigninActive: false,
    isUserActionActive: false,
    isAdministrationActive: false,
  },
  flavors: {},
  vendors: {},
  user: {
    auth: {
      signedIn: false,
      verified: false,
      isAdmin: false,
      firebaseUser: undefined,
    },
    details: {
      name: undefined,  // The public user display name.
      email: undefined,  // The private user email.
    },
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
    case '/user/recipes':
      newRoute.isUserRecipesActive = true;
      break;
    case '/user/signin':
      newRoute.isUserSigninActive = true;
      break;
    case '/user/action':
      newRoute.isUserActionActive = true;
      break;
    case '/administration':
      newRoute.isAdministrationActive = true;
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
  const newState = Object.assign({}, state);
  newState.user.auth = {
    signedIn: action.data.signedIn,
    verified: action.data.verified,
    firebaseUser: action.data.firebaseUser,
  };
  return newState;
}

function reducerUserDetails(state, action) {
  const newState = Object.assign({}, state);
  newState.user.details = {
    name: action.data.name,
    email: action.data.email,
  };
  return newState;
}

function reducerUserAdmin(state, action) {
  const newState = Object.assign({}, state);
  newState.user.auth.isAdmin = action.data.isAdmin;
  return newState;
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
    case 'USER_DETAILS':
      return reducerUserDetails(state, action);
    case 'USER_ADMIN':
      return reducerUserAdmin(state, action);
  }
  return state;
}

const reduxStore = Redux.createStore(reduxReducer);
const DiyMixinRedux = PolymerRedux(reduxStore);
