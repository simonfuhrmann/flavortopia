class DiyAllFlavors extends DiyMixinStaticData(Polymer.Element) {
  static get is() {
    return 'diy-all-flavors';
  }

  toFlavorsArray_(flavors) {
    return Object.keys(flavors);
  }
}

customElements.define(DiyAllFlavors.is, DiyAllFlavors);
