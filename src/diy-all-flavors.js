class DiyAllFlavors extends DiyMixinRedux(Polymer.Element) {
  static get is() {
    return 'diy-all-flavors';
  }

  static get properties() {

  }

  onLoadDataTap_() {
    this.$.firebase.firebaseInit();
    this.$.firebase.firebaseTest();
  }

  onLogStoreTap_() {
    console.log(this.getState());
  }
}

customElements.define(DiyAllFlavors.is, DiyAllFlavors);
