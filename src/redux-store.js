const initialState = {
  flavors: {},
  vendors: {},
};

function reducerInitFlavors(state, action) {
  return Object.assign({}, state, { flavors: action.data });
}

function reducerInitVendors(state, action) {
  return Object.assign({}, state, { vendors: action.data });
}

const reduxReducer = function(state = initialState, action) {
  switch (action.type) {
    case 'INIT_FLAVORS':
      return reducerInitFlavors(state, action);
    case 'INIT_VENDORS':
      return reducerInitVendors(state, action);
  }
  return state;
}

const reduxStore = Redux.createStore(reduxReducer);
const ReduxMixin = PolymerRedux(reduxStore);
