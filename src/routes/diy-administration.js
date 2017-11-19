class DiyAdministration extends DiyMixinRedux(Polymer.Element) {
  static get is() {
    return 'diy-administration';
  }

  static get properties() {
    return {
      isAdmin: {
        type: Boolean,
        statePath: 'user.auth.isAdmin',
      }
    };
  }
}

customElements.define(DiyAdministration.is, DiyAdministration);
