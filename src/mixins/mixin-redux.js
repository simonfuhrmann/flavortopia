const initialState = {
  appRoute: {
    path: '/',  // The URL path, e.g., /flavors.
    query: {},  // The URL query parameters, e.g., { foo: "bar" }.
    fragment: '',  // The URL fragment (part after the '#' in the URL).
    isWelcomeActive: false,
    isFlavorsActive: false,
    isRecipesActive: false,
    isSingleRecipeActive: false,
    isUserRecipesActive: false,
    isUserInventoryActive: false,
    isUserSigninActive: false,
    isUserActionActive: false,
    isAdministrationActive: false,
  },
  // Caches a mapping from userID to user name.
  userCache: {},
  // Information about the current user.
  user: {
    auth: {
      signedIn: false,
      verified: false,
      isAdmin: false,
      firebaseUser: undefined,
    },
    details: {
      name: undefined,  // The public user display name.
    },
  },
  // The current users flavor inventory.
  inventory: {},
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
  if (!action.data.route) return state;
  const url =  action.data.route.path || '/';
  const pathQueryFragment = parsePathQueryFragment(url);
  const newRoute = Object.assign({}, initialState.appRoute, pathQueryFragment);
  switch (newRoute.path) {
    case '/flavors':
      newRoute.isFlavorsActive = true;
      break;
    case '/recipes':
      newRoute.isRecipesActive = true;
      break;
    case '/recipe':
      newRoute.isSingleRecipeActive = true;
      break;
    case '/user/recipes':
      newRoute.isUserRecipesActive = true;
      break;
    case '/user/inventory':
      newRoute.isUserInventoryActive = true;
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

function reducerUserSignin(state, action) {
  const newState = Object.assign({}, state);
  newState.user = Object.assign({}, state.user);
  newState.user.auth = {
    signedIn: action.data.signedIn,
    verified: action.data.verified,
    firebaseUser: action.data.firebaseUser,
  };
  return newState;
}

function reducerUserSignout(state, action) {
  const newState = Object.assign({}, state);
  newState.user = initialState.user;
  newState.inventory = initialState.inventory;
  return newState;
}

function reducerUserDetails(state, action) {
  const newState = Object.assign({}, state);
  newState.user = Object.assign({}, state.user);
  newState.user.details = {
    name: action.data.name,
    email: action.data.email,
  };
  return newState;
}

function reducerUserAdmin(state, action) {
  const newState = Object.assign({}, state);
  newState.user = Object.assign({}, state.user);
  newState.user.auth = Object.assign({}, state.user.auth);
  newState.user.auth.isAdmin = action.data.isAdmin;
  return newState;
}

function reducerCacheUser(state, action) {
  const newState = Object.assign({}, state);
  newState.userCache = Object.assign({}, state.userCache);
  newState.userCache[action.data.uid] = action.data.name;
  return newState;
}

function reducerSetInventory(state, action) {
  const newState = Object.assign({}, state);
  newState.inventory = action.data;
  return newState;
}

const reduxReducer = function(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_ROUTE':
      return reducerUpdateRoute(state, action);
    case 'USER_SIGNIN':
      return reducerUserSignin(state, action);
    case 'USER_SIGNOUT':
      return reducerUserSignout(state, action);
    case 'USER_DETAILS':
      return reducerUserDetails(state, action);
    case 'USER_ADMIN':
      return reducerUserAdmin(state, action);
    case 'CACHE_USER':
      return reducerCacheUser(state, action);
    case 'SET_INVENTORY':
      return reducerSetInventory(state, action);
  }
  return state;
}

const reduxStore = Redux.createStore(reduxReducer);
const DiyMixinReduxBase = PolymerRedux(reduxStore);

DiyMixinRedux = (superClass) => class extends DiyMixinReduxBase(superClass) {
  static get actions() {
    return {
      updateRoute(data) {
        return { type: 'UPDATE_ROUTE', data };
      },
      userSignin(data) {
        return { type: 'USER_SIGNIN', data };
      },
      userSignout(data) {
        return { type: 'USER_SIGNOUT', data };
      },
      userDetails(data) {
        return { type: 'USER_DETAILS', data };
      },
      userAdmin(data) {
        return { type: 'USER_ADMIN', data };
      },
      cacheUser(data) {
        return { type: 'CACHE_USER', data };
      },
      setInventory(data) {
        return { type: 'SET_INVENTORY', data };
      },
    };
  }
};
