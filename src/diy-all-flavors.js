class DiyAllFlavors extends DiyMixinRedux(Polymer.Element) {
  static get is() {
    return 'diy-all-flavors';
  }

  static get properties() {
    return {
      flavors: {
        type: Object,
        statePath: 'flavors',
      },
    };
  }

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

  onLoadDataTap_() {
    this.$.firebase.loadVendors()
        .then(snapshot => {
          this.dispatch('initVendors', snapshot.val());
        })
        .catch(error => {
          console.log('error loading vendors', error);
        });

    this.$.firebase.loadFlavors()
        .then(snapshot => {
          this.dispatch('initFlavors', snapshot.val());
        })
        .catch(error => {
          console.log('error loading vendors', error);
        });

  }

  onLogStoreTap_() {
    console.log(this.getState());
  }

  toFlavorsArray_(flavors) {
    return Object.keys(flavors);
  }
}

customElements.define(DiyAllFlavors.is, DiyAllFlavors);
