let database = undefined;

DiyMixinFirebase = (superClass) => class extends ReduxMixin(superClass) {
  static get actions() {
    return {
      initFlavors(data) {
        return { type: 'INIT_FLAVORS', data: data };
      },
      initVendors(data) {
        return { type: 'INIT_VENDORS', data: data };
      },
    };
  }
  firebaseInit() {
    if (database) {
      return;
    }

    // Initialize Firebase app.
    var config = {
      apiKey: "AIzaSyAHEzmqB5011Wy_1GL5JgNNFOKGd6jATA4",
      authDomain: "flavortopia.firebaseapp.com",
      databaseURL: "https://flavortopia.firebaseio.com",
      projectId: "flavortopia",
    };
    firebase.initializeApp(config);

    // Initialize database module.
    database = firebase.database();
  }

  firebaseTest() {
    // Load all flavors and update redux store.
    const flavorsRef = database.ref('flavors/');
    flavorsRef.on('value', function(snapshot) {
      this.dispatch('initFlavors', snapshot.val());
      flavorsRef.off();
    }.bind(this));

    // Load all vendors and update redux store.
    const vendorsRef = database.ref('vendors/');
    vendorsRef.on('value', function(snapshot) {
      this.dispatch('initVendors', snapshot.val());
      vendorsRef.off();
    }.bind(this));
  }
};
