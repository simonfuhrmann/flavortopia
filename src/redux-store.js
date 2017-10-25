const initialState = {
  flavors: [
    {
      flavorId: "cap-lime",
      flavorName: "Lime",
      vendorShort: "CAP",
      hasImage: false
    },
  ],
  vendors: [
    {
      vendorShort: 'CAP',
      vendorName: 'Cappella',
      hasImage: false,
    },
  ]
};

const reducer = function(state = initialState, action) {
  switch (action.type) {
    case 'ADD_TEST':
      state = reducerAddTest(state, action);
      break;
  }
  return state;
}

const store = Redux.createStore(reducer);
const ReduxMixin = PolymerRedux(store);

console.log(store.getState());