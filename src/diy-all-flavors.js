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

  onLoadDataTap_() {
    this.$.firebase.firebaseInit();
    this.$.firebase.firebaseTest();
  }

  onLogStoreTap_() {
    console.log(this.getState());
  }

  toFlavorsArray_(flavors) {
    return Object.keys(flavors);
  }
}

customElements.define(DiyAllFlavors.is, DiyAllFlavors);
