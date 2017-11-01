class DiyAllFlavors extends DiyMixinFirebase(Polymer.Element) {
  static get is() {
    return 'diy-all-flavors';
  }

  onLoadDataTap_() {
    this.firebaseInit();
    this.firebaseTest();
  }

  onLogStoreTap_() {
    console.log(this.getState());
  }
}

customElements.define(DiyAllFlavors.is, DiyAllFlavors);
